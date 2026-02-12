const express = require("express");
const path = require("path"); // Importante para manejar rutas de carpetas
const cors = require('cors');
require("./models");

const app = express(); // Solo una vez

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- LA LÍNEA CLAVE ---
// Esto le dice a Node: "Si alguien pide /uploads, busca los archivos en la carpeta real llamada uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- RUTAS ---
const authRoutes = require("./routes/auth.routes");
const reservaRoutes = require("./routes/reserva.routes");
const vueloRoutes = require("./routes/vuelo.routes");
const pasajeroRoutes = require("./routes/pasajero.routes");
const pagos = require("./routes/pago.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const adminRoutes = require("./routes/admin.routes");

app.use("/api/auth", authRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/vuelos", vueloRoutes);
app.use("/api/pasajeros", pasajeroRoutes);
app.use("/api/pagos", pagos);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API TravelHub funcionando 🚀" });
});

module.exports = app;