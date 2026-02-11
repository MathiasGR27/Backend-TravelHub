// seedAdmin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const Usuario = require("./src/models/usuario");
const { sequelize } = require("./src/models/database");
const { text } = require("express");

// seedAdmin.js actualizado
const crearAdminMaestro = async () => {
  try {
    await sequelize.authenticate();
    const passwordHash = await bcrypt.hash("23500", 10);
    
    // Cambiamos 'create' por 'findOrCreate' para evitar crasheos si ya existe
    const [admin, creado] = await Usuario.findOrCreate({
      where: { email: "admin@travelhub.com" },
      defaults: {
        nombre_completo: "Admin",
        telefono: "0991629781",
        password: passwordHash,
        rol: "ADMIN",
        puntos: 0
      }
    });
    
    if (creado) {
      console.log(" Admin maestro creado por primera vez");
    } else {
      console.log(" El admin ya existe en la base de datos");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error al crear admin:", error);
    process.exit(1);
  }
};

crearAdminMaestro();