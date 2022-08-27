const express = require('express');
const { uploader } = require('../config/upload');
const {postingController}= require('../controlers');
const route = express.Router();

const uploadFile = uploader('/image_posting','/IMGPOST').array('images',1)

route.get('/',postingController.getDataPosting)
route.get('/:id',postingController.getDataPostingById)
route.get('/profile/:id',postingController.getDataPostingByUser)
route.post('/',uploadFile,postingController.postPosting)
route.delete('/:id',postingController.deletePosting)
route.patch('/:id',postingController.editPosting)

module.exports=route