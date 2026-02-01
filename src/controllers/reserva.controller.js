const Reserva = require("../models/reserva");
const VueloOferta = require("../models/vueloOferta");
const Pasajero = require("../models/pasajero");

// CREAR RESERVA
const crearReserva = async (req, res) => {
  try {
    const { id_vuelo, pasajeros } = req.body;
    const usuario = req.usuario; // usamos todo el objeto

    // Validar vuelo
    const vuelo = await VueloOferta.findByPk(id_vuelo);
    if (!vuelo) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    // Crear reserva (total en 0 por ahora)
    const reserva = await Reserva.create({
      id_usuario: usuario.id,
      id_vuelo,
      total: 0
    });

    // Crear pasajero principal (usuario logueado)
    await Pasajero.create({
      nombre: usuario.nombre || "Titular",
      apellido: usuario.apellido || "Reserva",
      documento: usuario.documento || "N/A",
      id_reserva: reserva.id_reserva
    });

    // Crear pasajeros adicionales 
    if (Array.isArray(pasajeros) && pasajeros.length > 0) {
      const pasajerosConReserva = pasajeros.map(p => ({
        ...p,
        id_reserva: reserva.id_reserva
      }));

      await Pasajero.bulkCreate(pasajerosConReserva);
    }

    // Contar pasajeros reales
    const totalPasajeros = await Pasajero.count({
      where: { id_reserva: reserva.id_reserva }
    });

    // Calcular total correcto
    reserva.total = vuelo.precio * totalPasajeros;
    await reserva.save();

    res.status(201).json({
      message: "Reserva creada correctamente",
      reserva,
      totalPasajeros,
      total: reserva.total
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
