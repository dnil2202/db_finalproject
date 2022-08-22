const { dbConf, dbQuery } = require('../config/db');

module.exports={

    getComment: async(req,res)=>{
        try {
            let GetDataComment=await dbQuery(`Select * from comment`)
            res.status(200).send(GetDataComment)
        } catch (error) {
            console.log(error)
        }

    },
    postComment: async(req,res)=>{
        try {
            let {comment, user_comment_id, posting_id}=req.body
            if(comment.length <= 300){
                let addComment = await dbQuery(`INSERT INTO COMMENT (comment,user_comment_id,posting_id)values(
                ${dbConf.escape(comment)},
                ${dbConf.escape(user_comment_id)},
                ${dbConf.escape(posting_id)});`)
                res.status(200).send({
                    success :true,
                    message:'Add comment success'
                })
            }else{
                res.status(500).send({
                    success :false,
                    message:'Max charachter 300'
                })
            }
        } catch (error) {
            console.log(error)
        }

    },
    deleteComment: async(req,res)=>{

    },
    editComment: async(req,res)=>{

    },
}