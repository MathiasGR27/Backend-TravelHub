const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const { misPuntos } = require("../controllers/usuario.controller");

// Usuario logeado
router.get("/mis-puntos", authMiddleware, misPuntos);

module.exports = router;
