const VueloOferta = require("../models/vueloOferta");

// CREAR VUELO 
const crearVuelo = async (req, res) => {
  try {
    const { origen, destino, precio } = req.body;

    const vuelo = await VueloOferta.create({ origen, destino, precio });

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
    const { origen, destino } = req.query;

    const vuelos = await VueloOferta.findAll({
      where: { origen, destino }
    });

    res.json(vuelos);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar vuelos" });
  }
};

// EDITAR VUELO (ADMIN)
const editarVuelo = async (req, res) => {
  try {
    const { id } = req.params;
    const { origen, destino, precio } = req.body;

    const vuelo = await VueloOferta.findByPk(id);
    if (!vuelo) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    await vuelo.update({ origen, destino, precio });

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
