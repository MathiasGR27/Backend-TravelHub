const { sequelize, DataTypes } = require("./database");

const Reserva = sequelize.define("Reserva", {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_reserva: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_vuelo: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "reservas",
  timestamps: false
});

module.exports = Reserva;
