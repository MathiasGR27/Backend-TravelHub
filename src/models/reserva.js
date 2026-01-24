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
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  tableName: "reservas",
  timestamps: false
});

module.exports = Reserva;
