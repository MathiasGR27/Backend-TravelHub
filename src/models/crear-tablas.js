const { sequelize } = require("./database");
require("./index"); 

const iniciar = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectada a la base de datos");

    await sequelize.sync({ alter: true });
    console.log("Tablas creadas o actualizadas correctamente");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
  }
};

iniciar();
