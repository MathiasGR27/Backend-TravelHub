const Pasajero = require("../models/pasajero");
const Reserva = require("../models/reserva");

const crearPasajero = async (req, res) => {
  try {
    const { id_reserva } = req.params;
    const { nombre, apellido, documento } = req.body;

    // Verificar que la reserva exista y sea del usuario
    const reserva = await Reserva.findOne({
      where: {
        id_reserva,
        id_usuario: req.usuario.id
      }
    });

    if (!reserva) {
      return res.status(403).json({ message: "No tienes acceso a esta reserva" });
    }

    const pasajero = await Pasajero.create({
      nombre,
      apellido,
      documento,
      id_reserva
    });

    res.status(201).json(pasajero);

  } catch (error) {
    res.status(500).json({ message: "Error al crear pasajero" });
  }
};

const verPasajerosPorReserva = async (req, res) => {
  try {
    const { id_reserva } = req.params;

    const reserva = await Reserva.findOne({
      where: {
        id_reserva,
        id_usuario: req.usuario.id
      }
    });

    if (!reserva) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const pasajeros = await Pasajero.findAll({
      where: { id_reserva }
    });

    res.json(pasajeros);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener pasajeros" });
  }
};

module.exports = { crearPasajero, verPasajerosPorReserva };