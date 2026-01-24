const { sequelize, DataTypes } = require("./database");

const VueloOferta = sequelize.define("VueloOferta", {
  id_vuelo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  origen: DataTypes.TEXT,
  destino: DataTypes.TEXT,
  precio: DataTypes.DECIMAL
}, {
  tableName: "vuelos_oferta",
  timestamps: false
});

module.exports = VueloOferta;
