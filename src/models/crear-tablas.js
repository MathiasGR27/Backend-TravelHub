const { sequelize } = require("./database");

const Usuario = require("./usuario");
const Reserva = require("./reserva");
const Pasajero = require("./pasajero");
const VueloOferta = require("./vueloOferta");
const Pago = require("./pago");

/* RELACIONES */

// Usuario 1:N Reserva
Usuario.hasMany(Reserva, { foreignKey: "id_usuario" });
Reserva.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Reserva 1:N Pasajero
Reserva.hasMany(Pasajero, { foreignKey: "id_reserva" });
Pasajero.belongsTo(Reserva, { foreignKey: "id_reserva" });

// Reserva 1:1 Pago
Reserva.hasOne(Pago, { foreignKey: "id_reserva" });
Pago.belongsTo(Reserva, { foreignKey: "id_reserva" });

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
