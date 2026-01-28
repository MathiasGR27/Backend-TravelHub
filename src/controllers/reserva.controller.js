const Reserva = require("../models/reserva");
const VueloOferta = require("../models/vueloOferta");
const Pasajero = require("../models/pasajero");

//CREAR RESERVA
const crearReserva = async (req, res) => {
  try {
    const { id_vuelo, pasajeros } = req.body;
    const id_usuario = req.usuario.id;

    // Validar vuelo
    const vuelo = await VueloOferta.findByPk(id_vuelo);
    if (!vuelo) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    // Crear reserva
    const reserva = await Reserva.create({
      id_usuario,
      id_vuelo,
      total: 0
    });

    let total = 0;


    // Si vienen pasajeros crearlos
    if (Array.isArray(pasajeros) && pasajeros.length > 0) {
      const pasajerosConReserva = pasajeros.map(p => ({
        ...p,
        id_reserva: reserva.id_reserva
      }));

      await Pasajero.bulkCreate(pasajerosConReserva);

      total = vuelo.precio * pasajeros.length;
      await reserva.save();
    }

    res.status(201).json({
      message: "Reserva creada correctamente",
      reserva,
      pasajeros: pasajeros?.length || 0,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear reserva" });
  }
};


//VER RESERVAS DEL USUARIO LOGEADO
const misReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      where: { id_usuario: req.usuario.id },
      include: [
        { model: VueloOferta },
        { model: Pasajero }
      ]
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas" });
  }
};

//VER TODAS LAS RESERVAS ADMIN
const verTodasLasReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: VueloOferta },
        { model: Pasajero }
      ]
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas" });
  }
};

module.exports = {crearReserva,misReservas,verTodasLasReservas};
