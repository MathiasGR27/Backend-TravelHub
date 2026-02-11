// src/models/crear-tablas.js
const { sequelize } = require("./database");
require("./index"); // Asegúrate de que esto cargue todos tus modelos y relaciones

const iniciarBaseDeDatos = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Conexión establecida con PostgreSQL.");

    // CAMBIO AQUÍ: force: true borra TODO y recrea las tablas
    await sequelize.sync({ alter: true }); 
    console.log(" Base de datos limpia y recreada con éxito.");

    process.exit(0);
  } catch (error) {
    console.error(" Error durante la reconstrucción:", error);
    process.exit(1);
  }
};

iniciarBaseDeDatos();