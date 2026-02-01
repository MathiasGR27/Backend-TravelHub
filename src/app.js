const express = require("express");
const app = express();
require("./models");

app.use(express.json());

// Rutas
const authRoutes = require("./routes/auth.routes");
const reservaRoutes = require("./routes/reserva.routes");
const vueloRoutes = require("./routes/vuelo.routes");
const pasajeroRoutes = require("./routes/pasajero.routes");
const pagos = require("./routes/pago.routes");
const usuarioRoutes = require("./routes/usuario.routes");

app.use("/api/auth", authRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/vuelos", vueloRoutes);
app.use("/api/pasajeros", pasajeroRoutes);
app.use("/api/pagos", pagos);
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API TravelHub funcionando 🚀" });
});

module.exports = app;
