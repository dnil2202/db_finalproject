const express = require('express');
const { readToken } = require('../confiG/encript');
const { authController } = require("../controlers");
const route = express.Router();

route.get('/all', authController.getData);
route.post('/login', authController.login);
route.post('/regis', authController.register);
route.get('/keep',readToken, authController.keepLogin)

module.exports=route;