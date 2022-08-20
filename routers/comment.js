const express = require('express');
const{commentController}=require('../controlers');
const route = express.Router()

route.get('/',commentController.getComment)
route.post('/',commentController.postComment)
route.delete('/:id',commentController.deleteComment)
route.patch('/:id',commentController.editComment)


module.exports=route