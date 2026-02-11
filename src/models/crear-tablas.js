const { sequelize } = require("./database"); 
require("./index"); 

const iniciarBaseDeDatos = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida con PostgreSQL.");

    await sequelize.sync({ alter: true });
    console.log("🚀 Tablas actualizadas (columnas y relaciones listas).");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante la sincronización:", error);
    process.exit(1);
  }
};

iniciarBaseDeDatos();