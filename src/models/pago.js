const { sequelize, DataTypes } = require("./database");

const Pago = sequelize.define("Pago", {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  metodo: DataTypes.TEXT,
  monto: DataTypes.DECIMAL
}, {
  tableName: "pagos",
  timestamps: false
});

module.exports = Pago;
