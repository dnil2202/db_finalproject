const express = require('express');
const{likeController}=require('../controlers');
const route = express.Router()

route.get('/',likeController.getLike)
route.post('/',likeController.postLike)
route.delete('/:id',likeController.deleteLike)
route.patch('/:id',likeController.editLike)

module.exports=route