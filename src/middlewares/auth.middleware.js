const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Acceso denegado. Token no proporcionado"
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token inválido"
      });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secreto"
    );
    req.usuario = decoded;
    next(); 

  } catch (error) {
    return res.status(401).json({
      message: "Token no válido o expirado"
    });
  }
};

module.exports = authMiddleware;
