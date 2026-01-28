const { sequelize, DataTypes } = require("./database");

const VueloOferta = sequelize.define("VueloOferta", {
  id_vuelo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  origen: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  destino: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  tableName: "vuelos_oferta",
  timestamps: false
});

module.exports = VueloOferta;
