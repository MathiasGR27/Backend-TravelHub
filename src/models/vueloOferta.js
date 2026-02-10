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
  },
  fecha_salida: {
    type: DataTypes.DATEONLY, 
    allowNull: false
  },
  // --- NUEVOS CAMPOS ---
  hora_salida: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: "12:00:00"
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60 
  }
}, {
  tableName: "vuelos_oferta",
  timestamps: false
});

module.exports = VueloOferta;