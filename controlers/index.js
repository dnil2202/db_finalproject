const authController = require('./auth');
const postingController = require('./posting')
const commentController = require('./comment')
const likeController = require('./like')

module.exports={
    authController,
    postingController,
    commentController,
    likeController
}