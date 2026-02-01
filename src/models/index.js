const Usuario = require("./usuario");
const Reserva = require("./reserva");
const Pasajero = require("./pasajero");
const VueloOferta = require("./vueloOferta");
const Pago = require("./pago");

// Usuario 1:N Reserva
Usuario.hasMany(Reserva, {
  foreignKey: "id_usuario",
  as: "reservas"
});
Reserva.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario"
});

// Vuelo 1:N Reserva
VueloOferta.hasMany(Reserva, {
  foreignKey: "id_vuelo",
  as: "reservas"
});
Reserva.belongsTo(VueloOferta, {
  foreignKey: "id_vuelo",
  as: "vuelo"
});

// Reserva 1:N Pasajero
Reserva.hasMany(Pasajero, {
  foreignKey: "id_reserva",
  as: "pasajeros"
});
Pasajero.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva"
});

// Reserva 1:1 Pago
Reserva.hasOne(Pago, {
  foreignKey: "id_reserva",
  as: "pago"
});
Pago.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva"
});

module.exports = {Usuario,Reserva,Pasajero,VueloOferta,Pago};
