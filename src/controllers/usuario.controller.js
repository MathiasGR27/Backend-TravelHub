const Usuario = require("../models/usuario");

const misPuntos = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id_usuario", "nombre", "email", "puntos"]
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      puntos: usuario.puntos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener puntos" });
  }
};

module.exports = { misPuntos };
