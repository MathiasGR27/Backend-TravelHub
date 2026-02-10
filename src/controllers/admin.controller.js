const Pasajero = require("../models/pasajero");
const Reserva = require("../models/reserva");
const VueloOferta = require("../models/vueloOferta");

const validarReservaQR = async (req, res) => {
  try {
    const { codigo } = req.params; 

    const reserva = await Reserva.findOne({
      where: { codigo_qr: codigo },
      include: [
        { 
          model: VueloOferta, 
          as: "vuelo" // Verifica que en tu asociación diga as: "vuelo"
        },
        { 
          model: Pasajero, 
          as: "pasajeros" // Verifica que en tu asociación diga as: "pasajeros"
        }
      ]
    });

    if (!reserva) {
      return res.status(404).json({ 
        valido: false, 
        message: "Código de reserva no encontrado o inválido" 
      });
    }

    // --- MEJORA: Verificar si realmente está pagada ---
    if (reserva.estado !== "PAGADA") {
      return res.status(400).json({ 
        valido: false, 
        message: "Atención: El código existe pero la reserva aún no ha sido pagada",
        estado: reserva.estado 
      });
    }

    res.json({
      valido: true,
      detalles: {
        id_reserva: reserva.id_reserva,
        itinerario: `${reserva.vuelo.origen}  ${reserva.vuelo.destino}`,
        fecha: reserva.vuelo.fecha_salida,
        hora: reserva.vuelo.hora_salida || "No especificada",
        estado_pago: reserva.estado
      },
      conteo: {
        total_pasajeros: reserva.pasajeros.length
      },
      lista_pasajeros: reserva.pasajeros.map(p => ({
        nombre: p.nombre_completo,
        asiento: p.asiento,
        documento: p.documento
      }))
    });

  } catch (error) {
    console.error("Error en Validación QR:", error); 
    res.status(500).json({ message: "Error interno al validar el código" });
  }
};

module.exports = { validarReservaQR };