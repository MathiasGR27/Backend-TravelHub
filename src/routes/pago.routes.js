const express = require("express");
const router = express.Router();

const { confirmarPago,misPagos,verTodosLosPagos } = require("../controllers/pago.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { esAdmin } = require("../middlewares/rol.middleware");

// User
router.post("/confirmar", authMiddleware, confirmarPago);
router.get("/mis-pagos", authMiddleware, misPagos);

// Admin
router.get("/", authMiddleware, esAdmin, verTodosLosPagos);

module.exports = router;
