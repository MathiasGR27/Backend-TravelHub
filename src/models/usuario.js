const { sequelize, DataTypes } = require("./database");

const Usuario = sequelize.define("Usuario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  puntos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rol: {
    type: DataTypes.ENUM("ADMIN", "USER"),
    allowNull: false,
    defaultValue: "USER"
  }
}, {
  tableName: "usuarios",
  timestamps: false
});

module.exports = Usuario;
