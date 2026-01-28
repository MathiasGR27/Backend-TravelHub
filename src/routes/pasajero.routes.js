const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const { crearPasajero,verPasajerosPorReserva } = require("../controllers/pasajero.controller");

router.post("/reserva/:id_reserva",authMiddleware,crearPasajero);
router.get("/reserva/:id_reserva",authMiddleware,verPasajerosPorReserva);

module.exports = router;
