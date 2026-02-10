const express = require("express");
const router = express.Router();

const { validarReservaQR } = require("../controllers/admin.controller"); 

const authMiddleware = require("../middlewares/auth.middleware");
const { esAdmin } = require("../middlewares/rol.middleware");

router.get("/validar-qr/:codigo", authMiddleware, esAdmin, validarReservaQR);

module.exports = router;