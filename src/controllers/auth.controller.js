const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

// REGISTRO
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body; 

    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      rol: "USER" 
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// CREAR OTRO ADMIN (Solo accesible por un ADMIN)
const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      rol: "ADMIN" 
    });

    res.status(201).json({ message: "Nuevo administrador creado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear administrador" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        puntos: usuario.puntos
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { register, login, crearAdmin };
