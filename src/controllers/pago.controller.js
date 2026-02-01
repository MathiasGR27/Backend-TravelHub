const Pago = require("../models/pago");
const Reserva = require("../models/reserva");
const Usuario = require("../models/usuario");
const VueloOferta = require("../models/vueloOferta");
const Pasajero = require("../models/pasajero");

const obtenerDescuentoPorPuntos = (puntosUsados) => {
  if (puntosUsados >= 3000) return 0.30;
  if (puntosUsados >= 2500) return 0.25;
  if (puntosUsados >= 2000) return 0.20;
  if (puntosUsados >= 1500) return 0.15;
  if (puntosUsados >= 900)  return 0.10;
  if (puntosUsados >= 450)  return 0.05;
  return 0;
};


const confirmarPago = async (req, res) => {
  try {
    const { id_reserva, metodo, usar_puntos, puntos_usar } = req.body;
    const id_usuario = req.usuario.id;

    const reserva = await Reserva.findOne({
      where: { id_reserva, id_usuario }
    });

    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (reserva.estado === "PAGADA") {
      return res.status(400).json({ message: "La reserva ya está pagada" });
    }

    const usuario = await Usuario.findByPk(id_usuario);

    let descuento = 0;
    let puntosUsados = 0;

    // VALIDAR USO DE PUNTOS
    if (usar_puntos) {

      if (!puntos_usar || puntos_usar <= 0) {
        return res.status(400).json({
          message: "Debe indicar cuántos puntos desea usar"
        });
      }

      if (puntos_usar > usuario.puntos) {
        return res.status(400).json({
          message: "No tiene puntos suficientes para aplicar el descuento"
        });
      }

      descuento = obtenerDescuentoPorPuntos(puntos_usar);

      if (descuento === 0) {
        return res.status(400).json({
          message: "Los puntos ingresados no alcanzan el mínimo para descuento"
        });
      }

      puntosUsados = puntos_usar;
    }

    const montoDescuento = reserva.total * descuento;
    const totalFinal = reserva.total - montoDescuento;

    const pago = await Pago.create({
      monto: totalFinal,
      metodo,
      id_reserva
    });

    reserva.estado = "PAGADA";
    await reserva.save();

    // Actualizar puntos
    usuario.puntos = usuario.puntos - puntosUsados + Math.floor(totalFinal);
    await usuario.save();

    res.status(200).json({
      message: "Pago realizado con éxito",
      total_original: reserva.total,
      descuento_aplicado: `${descuento * 100}%`,
      puntos_usados: puntosUsados,
      total_pagado: totalFinal,
      puntos_actuales: usuario.puntos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar pago" });
  }
};


const misPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      include: [{
        model: Reserva,
        as: "reserva",
        where: { id_usuario: req.usuario.id },
        include: [{
          model: VueloOferta,
          as: "vuelo"
        }]
      }]
    });

    res.json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener pagos" });
  }
};

const verTodosLosPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      include: [{
        model: Reserva, as: "reserva",
        include: [
          { model: Usuario, attributes: ["nombre", "email"] },
          { model: VueloOferta , as: "vueloOferta" },
          { model: Pasajero, as: "pasajeros" }
        ]
      }]
    });

    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pagos" });
  }
};


module.exports = { confirmarPago, misPagos, verTodosLosPagos };
