const Usuario = require("../models/usuario");

// controllers/usuario.controller.js
const misPuntos = async (req, res) => {
  try {
    // Verificamos qué trae el token para depurar
    console.log("Token decodificado:", req.usuario);

    // Intentamos obtener el ID de varias formas comunes
    const userId = req.usuario.id_usuario || req.usuario.id || req.usuario.sub;

    if (!userId) {
      return res.status(400).json({ message: "No se encontró ID en el token" });
    }

    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devolvemos los puntos actuales
    res.json({
      puntos: usuario.puntos,
      nombre: usuario.nombre
    });

  } catch (error) {
    console.error("Error en misPuntos:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

module.exports = { misPuntos };
