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
            let userAction = await dbQuery(`INSERT INTO LIKES (postId,userId)values(${dbConf.escape(postId)},${dbConf.escape(userId)});`)
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
            let userAction = await dbQuery(`Delete from likes where id=${req.params.id}`)
             res.status(200).send({
                success:true,
                message:'Undo Like Success'
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

    getLikeDetailUser : async(req,res)=>{
        try {
            let resultsLike = await dbQuery(`Select u.idusers,u.username,u.images as avatar ,p.idposting,p.add_date,p.images,l.id,l.postId from users u JOIN likes l ON u.idusers=l.userId 
                    JOIN newposting p ON p.idposting = l.postId WHERE l.userId =${req.params.id};`)
            res.status(200).send(resultsLike)
        } catch (error) {
            console.log(error)
        }
    }
}