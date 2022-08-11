const express = require('express');
const { readToken } = require('../confiG/encript');
const { authController } = require("../controlers");
const route = express.Router();
const { uploader }= require('../config/upload')


const upload = uploader('/img_profile','/IMGPROFILE').array('images',1)

route.get('/all', authController.getData);
route.post('/login', authController.login);
route.post('/regis',authController.register);
route.get('/keep',readToken, authController.keepLogin)
route.patch('/verified',readToken,authController.verification)
route.patch('/all/:id',upload,authController.editProfile)
route.post ('/resend',authController.resendEmail)

module.exports=route;