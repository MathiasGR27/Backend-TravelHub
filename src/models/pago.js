const { sequelize, DataTypes } = require("./database");

const Pago = sequelize.define("Pago", {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  monto: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  metodo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "pagos",
  timestamps: false
});

module.exports = Pago;
