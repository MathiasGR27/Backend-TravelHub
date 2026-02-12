const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const Usuario = require('../models/usuario');
const multer = require('multer');
const path = require('path');

const { misPuntos } = require("../controllers/usuario.controller");

const storage = multer.diskStorage({
  destination: 'uploads/', 
  filename: (req, file, cb) => {
    const userId = req.params.id || 'unknown';
    cb(null, `avatar-${userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Límite de 2MB por foto
});

// --- RUTAS ---
router.get("/mis-puntos", authMiddleware, misPuntos);

router.post("/update-avatar/:id", authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No se subió ninguna imagen" });
    }

    // Construimos la URL completa para acceder a la imagen
    const urlFoto = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Actualizamos en la base de datos con Sequelize
    await Usuario.update({ foto: urlFoto }, { where: { id_usuario: id } });

    res.json({
      message: "Foto de perfil actualizada con éxito",
      foto: urlFoto
    });
  } catch (error) {
    console.error("Error al subir avatar:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;