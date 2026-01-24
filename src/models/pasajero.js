const { sequelize, DataTypes } = require("./database");

const Pasajero = sequelize.define("Pasajero", {
  id_pasajero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.TEXT,
  documento: DataTypes.TEXT
}, {
  tableName: "pasajeros",
  timestamps: false
});

module.exports = Pasajero;
