const { dbConf, dbQuery } = require('../config/db');

module.exports={

    getLike: async(req,res)=>{
        try {
            let getLike = await dbQuery(`SELECT * from likes`)
            res.status(200).send(getLike)
        } catch (error) {
            console.log(error)
        }

    },
    postLike: async(req,res)=>{
        try {
            let {postId,userId}=req.body
            let userAction = await dbQuery(`INSERT INTO LIKES (postId,userId,action)values(${dbConf.escape(postId)},${dbConf.escape(userId)},${dbConf.escape(1)});`)
             res.status(200).send({
                success:true,
                message:'Add Like Success'
             })
        } catch (error) {
            console.log(error)
        }

    },
    deleteLike: async(req,res)=>{
        try {
            let userAction = await dbQuery(`Delete from likes where postId=${req.params.id}`)
             res.status(200).send({
                success:true,
                message:'Add Like Success'
             })
        } catch (error) {
            console.log(error)
        }
    },

    editLike: async(req,res)=>{
        try {
            let userAction = await dbQuery(`UPDATE likes set action = ${dbConf.escape(0)} where postId=${req.params.id}`)
             res.status(200).send({
                success:true,
                message:'Add Like Success'
             })
        } catch (error) {
            console.log(error)
        }
    },
}