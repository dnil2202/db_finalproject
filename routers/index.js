const authRouter = require('./auth');
const postingRouter=require('./posting')
const commentRouter = require('./comment')
const likeRouter = require('./like')

module.exports={
    authRouter,
    postingRouter,
    commentRouter,
    likeRouter
}