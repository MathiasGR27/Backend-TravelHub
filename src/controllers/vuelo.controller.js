const VueloOferta = require("../models/vueloOferta");
const { Op } = require("sequelize");

// CREAR VUELO 
const crearVuelo = async (req, res) => {
  try {
    const { origen, destino, precio, fecha_salida } = req.body;

    if (!origen || !destino || !precio || !fecha_salida) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const vuelo = await VueloOferta.create({origen,destino,precio,fecha_salida});

    res.status(201).json({
      message: "Vuelo creado correctamente",
      vuelo
    });

  } catch (error) {
    res.status(500).json({ message: "Error al crear el vuelo" });
  }
};

// LISTAR VUELOS 
const listarVuelos = async (req, res) => {
  try {
    const vuelos = await VueloOferta.findAll();
    res.json(vuelos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vuelos" });
  }
};

// BUSCAR VUELOS
const buscarVuelos = async (req, res) => {
  try {
    const {origen,destino,fecha,minPrecio,maxPrecio,ordenPrecio} = req.query;

    const where = {};
    const order = [];

    // Origen y destino
    if (origen) where.origen = origen;
    if (destino) where.destino = destino;

    // Fecha de salida
    if (fecha) where.fecha_salida = fecha;

    // Rango de precios
    if (minPrecio || maxPrecio) {
      where.precio = {};
      if (minPrecio) where.precio[Op.gte] = minPrecio;
      if (maxPrecio) where.precio[Op.lte] = maxPrecio;
    }

    // Ordenar por precio
    if (ordenPrecio === "asc") {
      order.push(["precio", "ASC"]);
    }
    if (ordenPrecio === "desc") {
      order.push(["precio", "DESC"]);
    }

    const vuelos = await VueloOferta.findAll({
      where,
      order
    });

    res.json(vuelos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar vuelos" });
  }
};

// EDITAR VUELO (ADMIN)
const editarVuelo = async (req, res) => {
  try {
    const { id } = req.params;
    const { origen, destino, precio, fecha_salida } = req.body;

    const vuelo = await VueloOferta.findByPk(id);
    if (!vuelo) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    await vuelo.update({ origen, destino, precio, fecha_salida });

    res.json({ message: "Vuelo actualizado", vuelo });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar vuelo" });
  }
};

// ELIMINAR VUELO (ADMIN)
const eliminarVuelo = async (req, res) => {
  try {
    const { id } = req.params;

    const vuelo = await VueloOferta.findByPk(id);
    if (!vuelo) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    await vuelo.destroy();
    res.json({ message: "Vuelo eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar vuelo" });
  }
};

module.exports = {crearVuelo,listarVuelos,buscarVuelos,editarVuelo,eliminarVuelo};
