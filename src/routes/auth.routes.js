const express = require("express");
const router = express.Router();

const {register,login,crearAdmin} = require("../controllers/auth.controller");
const  authMiddleware  = require("../middlewares/auth.middleware"); 
const { esAdmin } = require("../middlewares/rol.middleware"); 

router.post("/register", register);
router.post("/login", login);
router.post("/crear-admin", authMiddleware, esAdmin, crearAdmin); 


module.exports = router;
