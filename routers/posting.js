const express = require('express');
const { uploader } = require('../config/upload_posing');
const {postingController}= require('../controlers');
const route = express.Router();

const uploadFile = uploader('/image_posting','IMGPOST').array('images',1)

route.get('/',postingController.getDataPosting)
route.post('/',uploadFile,postingController.postPosting)

module.exports=route