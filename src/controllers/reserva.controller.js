const Reserva = require("../models/reserva");
const VueloOferta = require("../models/vueloOferta");
const Pasajero = require("../models/pasajero");
const Usuario = require("../models/usuario"); // Corregido: Capitalizado por convención

// --- NUEVA FUNCIÓN AUXILIAR PARA EL FRONTEND ---
const obtenerAsientosOcupados = async (req, res) => {
  try {
    const { id_vuelo } = req.params;
    const pasajeros = await Pasajero.findAll({
      include: [{ model: Reserva, as: "reserva", where: { id_vuelo } }],
      attributes: ['asiento']
    });
    const ocupados = pasajeros.map(p => p.asiento);
    res.json(ocupados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener asientos" });
  }
};

// --- CREAR RESERVA (ACTUALIZADO) ---
const crearReserva = async (req, res) => {
  try {
    const { id_vuelo, asiento, pasajeros_adicionales } = req.body; 
    const usuario = req.usuario; // Objeto que viene del middleware

    // 1. Validar que el vuelo existe
    const vuelo = await VueloOferta.findByPk(id_vuelo);
    if (!vuelo) return res.status(404).json({ message: "Vuelo no encontrado" });

    // 2. Construir lista de pasajeros
    // 2. Construir lista de pasajeros
let nombreReal = "Pasajero Principal";

// Verificamos qué campos tiene el objeto usuario que viene del token
    if (usuario.nombre_completo) {
      nombreReal = usuario.nombre_completo;
    } else if (usuario.nombre && usuario.apellido) {
      nombreReal = `${usuario.nombre} ${usuario.apellido}`;
    } else if (usuario.nombre) {
      nombreReal = usuario.nombre;
    }

    let listaPasajeros = [{
      nombre_completo: nombreReal, 
      documento: usuario.documento || "N/A",
      asiento: asiento,
    }];

    if (Array.isArray(pasajeros_adicionales)) {
      pasajeros_adicionales.forEach(p => {
        listaPasajeros.push({
          nombre_completo: p.nombre_completo,
          documento: p.documento,
          asiento: p.asiento
        });
      });
    }

    // 3. Validar duplicados en la petición
    const todosLosAsientos = listaPasajeros.map(p => p.asiento);
    if (new Set(todosLosAsientos).size !== todosLosAsientos.length) {
      return res.status(400).json({ message: "No puedes duplicar asientos en la misma reserva" });
    }

    // 4. Validar disponibilidad en DB
    const ocupados = await Pasajero.findAll({
      include: [{ 
        model: Reserva, 
        as: "reserva", 
        where: { id_vuelo } 
      }],
      where: { asiento: todosLosAsientos }
    });

    if (ocupados.length > 0) {
      return res.status(400).json({ 
        message: "Asientos ya ocupados", 
        ocupados: ocupados.map(o => o.asiento) 
      });
    }

    // 5. Crear Reserva
    const reserva = await Reserva.create({
      id_usuario: usuario.id,
      id_vuelo: id_vuelo,
      total: vuelo.precio * listaPasajeros.length,
      estado: "PENDIENTE"
    });

    // 6. Crear Pasajeros vinculados
    const pasajerosFinal = listaPasajeros.map(p => ({
      nombre_completo: p.nombre_completo,
      documento: p.documento,
      asiento: p.asiento,
      id_reserva: reserva.id_reserva
    }));

    await Pasajero.bulkCreate(pasajerosFinal);

    res.status(201).json({ 
      message: "Reserva creada correctamente", 
      id_reserva: reserva.id_reserva,
      total: reserva.total 
    });

  } catch (error) {
    console.error("DETALLE DEL ERROR EN CONSOLA:", error); // Esto te dirá el error real en tu terminal
    res.status(500).json({ message: "Error interno al procesar reserva", error: error.message });
  }
};

const misReservas = async (req, res) => {
  try {
    // Agregamos un log para ver si llega el ID del usuario
    console.log("Buscando reservas para usuario ID:", req.usuario.id);

    const reservas = await Reserva.findAll({
      where: { id_usuario: req.usuario.id },
      include: [
        { 
          model: VueloOferta, 
          as: "vuelo" 
        },
        { 
          model: Pasajero, 
          as: "pasajeros",
          attributes: ['nombre_completo', 'asiento'] 
        }
      ],
      order: [['id_reserva', 'DESC']]
    });

    // Mapeo con validaciones de existencia (opcional ?. para evitar crash)
    const resultado = reservas.map(r => ({
      id_reserva: r.id_reserva,
      fecha_reserva: r.fecha_reserva,
      estado: r.estado,
      total: r.total,
      codigo_qr: r.codigo_qr,
      vuelo: r.vuelo ? {
        origen: r.vuelo.origen,
        destino: r.vuelo.destino,
        fecha: r.vuelo.fecha_salida,
        hora: r.vuelo.hora_salida
      } : null,
      pasajeros: r.pasajeros || []
    }));

    res.json(resultado);
  } catch (error) {
    // ESTO ES VITAL: Imprime el error real en tu consola del VS Code/Terminal
    console.error("ERROR EN MIS RESERVAS:", error); 
    res.status(500).json({ message: "Error al obtener reservas", details: error.message });
  }
};

// --- VER TODAS LAS RESERVAS ADMIN (ACTUALIZADO) ---
const verTodasLasReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { 
          model: Usuario, 
          as: "usuario", 
          attributes: ["nombre_completo", "email"] // Usamos el nuevo nombre de campo
        },
        { model: VueloOferta, as: "vuelo" },
        { model: Pasajero, as: "pasajeros" }
      ]
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas" });
  }
};

module.exports = {
  crearReserva,
  misReservas,
  verTodasLasReservas,
  obtenerAsientosOcupados
};