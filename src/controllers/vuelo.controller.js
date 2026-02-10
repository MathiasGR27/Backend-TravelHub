const VueloOferta = require("../models/vueloOferta");
const { Op } = require("sequelize");

// 1. CREAR VUELO (ADMIN)
const crearVuelo = async (req, res) => {
  try {
    const { origen, destino, precio, fecha_salida, hora_salida, capacidad } = req.body;

    if (!origen || !destino || !precio || !fecha_salida) {
      return res.status(400).json({ message: "Los campos básicos son obligatorios" });
    }

    const vuelo = await VueloOferta.create({
      origen,
      destino,
      precio,
      fecha_salida,
      hora_salida: hora_salida || "12:00:00",
      capacidad: capacidad || 60
    });

    res.status(201).json({ message: "Vuelo creado con éxito", vuelo });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el vuelo" });
  }
};

// 2. BUSCAR VUELOS (PÚBLICO/USER)
const buscarVuelos = async (req, res) => {
  try {
    const { origen, destino, fecha, minPrecio, maxPrecio, ordenPrecio } = req.query;

    const where = {};
    if (origen) where.origen = origen;
    if (destino) where.destino = destino;
    if (fecha) where.fecha_salida = fecha;

    if (minPrecio || maxPrecio) {
      where.precio = {};
      if (minPrecio) where.precio[Op.gte] = minPrecio;
      if (maxPrecio) where.precio[Op.lte] = maxPrecio;
    }

    const vuelos = await VueloOferta.findAll({
      where,
      order: ordenPrecio ? [['precio', ordenPrecio.toUpperCase()]] : []
    });

    res.json(vuelos);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar vuelos" });
  }
};

// 3. EDITAR VUELO (ADMIN)
const editarVuelo = async (req, res) => {
  try {
    const { id } = req.params;
    const { origen, destino, precio, fecha_salida, hora_salida, capacidad } = req.body;

    const vuelo = await VueloOferta.findByPk(id);
    if (!vuelo) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    
    await vuelo.update({
      origen: origen || vuelo.origen,
      destino: destino || vuelo.destino,
      precio: precio || vuelo.precio,
      fecha_salida: fecha_salida || vuelo.fecha_salida,
      hora_salida: hora_salida || vuelo.hora_salida,
      capacidad: capacidad || vuelo.capacidad
    });

    res.json({ message: "Vuelo actualizado correctamente", vuelo });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el vuelo" });
  }
};

// 4. ELIMINAR VUELO (ADMIN) 
const eliminarVuelo = async (req, res) => {
  try {
    const { id } = req.params;

    const vuelo = await VueloOferta.findByPk(id);
    if (!vuelo) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }
    await vuelo.destroy();
    
    res.json({ message: "Vuelo eliminado del sistema" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el vuelo" });
  }
};

// 5. LISTAR TODOS 
const listarVuelos = async (req, res) => {
  try {
    const vuelos = await VueloOferta.findAll({ order: [['fecha_salida', 'ASC']] });
    res.json(vuelos);
  } catch (error) {
    res.status(500).json({ message: "Error al listar vuelos" });
  }
};

module.exports = {
  crearVuelo,
  buscarVuelos,
  editarVuelo,
  eliminarVuelo,
  listarVuelos
};