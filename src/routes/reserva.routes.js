const express = require("express");
const router = express.Router();

const { crearReserva, misReservas, verTodasLasReservas  } = require("../controllers/reserva.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { esAdmin } = require("../middlewares/rol.middleware");


// USER
router.post("/", authMiddleware, crearReserva);
router.get("/mis-reservas", authMiddleware, misReservas);
// ADMIN
router.get("/", authMiddleware, esAdmin, verTodasLasReservas);

module.exports = router;
