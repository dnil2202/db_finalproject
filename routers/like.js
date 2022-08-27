const express = require('express');
const{likeController}=require('../controlers');
const route = express.Router()

route.get('/',likeController.getLike)
route.get('/:id',likeController.getLikeDetailUser)
route.post('/',likeController.postLike)
route.delete('/:id',likeController.deleteLike)
route.patch('/:id',likeController.editLike)

module.exports=route