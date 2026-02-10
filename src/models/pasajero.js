const { DataTypes } = require("sequelize");
const { sequelize } = require("./database");

const Pasajero = sequelize.define("Pasajero", {
  id_pasajero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_completo: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  asiento: {
    type: DataTypes.STRING(10), 
    allowNull: false
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "reservas",
      key: "id_reserva"
    },
    onDelete: "CASCADE"
  }
}, {
  tableName: "pasajeros",
  timestamps: false
});

module.exports = Pasajero;