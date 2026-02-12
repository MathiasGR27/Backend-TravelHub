const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const Usuario = require('../models/usuario');
const path = require('path');

// --- NUEVAS IMPORTACIONES PARA CLOUDINARY ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const { misPuntos } = require("../controllers/usuario.controller");

// 1. Configuración de Cloudinary (Usará las variables de Railway automáticamente)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configurar el almacenamiento en la nube en lugar de diskStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'perfiles_travelhub', // Carpeta que se creará en tu Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }] // La hace cuadrada y liviana
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Límite de 2MB
});

// --- RUTAS ---
router.get("/mis-puntos", authMiddleware, misPuntos);

// ACTUALIZADO: Esta ruta ahora manda la foto a la nube
router.post("/update-avatar/:id", authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No se subió ninguna imagen" });
    }

    // IMPORTANTE Cloudinary nos da la URL segura en req.file.path
    // Ya no usamos req.get('host') porque la imagen no está en tu servidor
    const urlFoto = req.file.path; 

    // Actualizamos en la base de datos con Sequelize
    // Usamos el id_usuario que es tu columna en Postgres
    await Usuario.update({ foto: urlFoto }, { where: { id_usuario: id } });

    res.json({
      message: "¡Foto de perfil actualizada en la nube con éxito! ☁️",
      foto: urlFoto
    });
  } catch (error) {
    console.error("Error al subir avatar a Cloudinary:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;