// seedAdmin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const Usuario = require("./src/models/usuario");
const { sequelize } = require("./src/models/database");

const crearAdminMaestro = async () => {
  try {
    await sequelize.authenticate();
    const passwordHash = await bcrypt.hash("23500", 10);
    
    await Usuario.create({
      nombre: "Admin",
      email: "admin@travelhub.com",
      password: passwordHash,
      rol: "ADMIN"
    });
    
    console.log("Admin maestro creado");
    process.exit(0);
  } catch (error) {
    console.error("Error al crear admin:", error);
    process.exit(1);
  }
};

crearAdminMaestro();