const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getDataPosting: async (req, res) => {
        console.log(req.query)
        try {
            let {page, pageSize}=req.query
            page = parseInt(page)
            pageSize = parseInt(pageSize)
            let offset = (page -1)*pageSize
            console.log(offset,pageSize)
            
            
            let resultPost = await dbQuery(`select p.idposting, p.images, p.caption,p.add_date,p.edit_date, x.username as user_name_post, x.images as avatar
            from newposting p left join users x on x.idusers = p.user_id Order BY add_date DESC Limit ${pageSize} offset ${offset} ;`);
            console.log(resultPost.length)

            let postComments = await Promise.all(resultPost.map(async(post)=>{
                let comment = await dbQuery(`select c.idcomment,c.posting_id,comment,u.fullname as user_name_comment from comment c left join users u on u.idusers=c.user_comment_id where posting_id = ${post.idposting} Order BY created_date DESC`);
                if(comment.length > 0){
                    post['comment']= comment 
                }
                return post
            })) 

            let postCommentsLikes = await Promise.all(postComments.map(async(postCom)=>{
                let getLikes = await dbQuery(`select l.id, l.postId,u.idusers, u.fullname as user_name_likes from likes l left join users u on u.idusers=l.userId where postId = ${postCom.idposting}`)
                if(getLikes.length > 0){
                    postCom['likes']= getLikes 
                }else{
                    postCom['likes']= []
                }
                return postCom
            }))

            res.status(200).send(
                postCommentsLikes
            )

        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },

    postPosting: async (req, res) => {
        try {
            let data = JSON.parse(req.body.data);
            // Proses data ke mysql
            let dataInput = [];
            for (const prop in data) {
                dataInput.push(dbConf.escape(data[prop]));
            }
            console.log(dataInput);
            dataInput.splice(0,0,dbConf.escape(`/image_posting${req.files[0].filename}`),);
            console.log('After', dataInput);
            let addData = await dbQuery(
                `INSERT INTO NEWPOSTING (images,caption,user_id)values (${dataInput.join(
                    ',',
                )})`,
            );
            res.status(200).send({
                newPost:addData,
                success: true,
                message: 'Add Posting Success',
            });
        } catch (error) {
            console.log(error);
            // Menghapus gagal ketika upload
            fs.unlinkSync(`./public/image_posting/${req.files[0].filename}`);
            res.status(500).send(error);
        }
    },

    deletePosting: async (req, res) => {
        console.log(req.params);
        try {
            await dbQuery(
                `DELETE from newposting where idposting = ${req.params.id}`,
            );
            await dbQuery(`Delete from likes where postId = ${req.params.id}`)
            await dbQuery(`Delete from comment where posting_id = ${req.params.id}`)
            
            res.status(200).send({
                success: true,
                message: 'Posting deleted',
            });
        } catch (error) {
            res.status(500).send(error);
        }
    },

    editPosting: async (req, res) => {
        try {
            await dbQuery(`UPDATE newposting set caption = ${dbConf.escape(req.body.caption)} where idposting = ${req.params.id}`)
            res.status(200).send({
                success: true,
                message: 'Caption Updated',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },

    getDataPostingById : async (req,res)=>{

        try {
            let {page, pageSize}=req.query
            page = parseInt(page)
            pageSize = parseInt(pageSize)
            let offset = (page -1)*pageSize
            console.log(offset,pageSize)

            let resultPost = await dbQuery(`select p.idposting, p.images, p.caption, p.add_date,x.images as avatar, x.username as user_name_post, x.images as avatar
            from newposting p left join users x on x.idusers = p.user_id where p.idposting = ${req.params.id}`)
    
            let postComments = await Promise.all(resultPost.map(async(post)=>{
                let comment = await dbQuery(`select c.idcomment,c.posting_id,comment,u.fullname as user_name_comment from comment c left join users u on u.idusers=c.user_comment_id where posting_id = ${post.idposting} Order BY created_date DESC  Limit ${pageSize} offset ${offset}`);
                if(comment.length > 0){
                    post['comment']= comment 
                }
                return post
            })) 
    
            let postCommentsLikes = await Promise.all(postComments.map(async(postCom)=>{
                let getLikes = await dbQuery(`select l.id, l.postId,u.idusers, u.fullname as user_name_likes from likes l left join users u on u.idusers=l.userId where postId = ${postCom.idposting} `)
                if(getLikes.length > 0){
                    postCom['likes']= getLikes 
                }else{
                    postCom['likes']= []
                }
                return postCom
            }))
            res.status(200).send(
                postCommentsLikes
            )
            
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }

       

    },

    getDataPostingByUser:async (req,res)=>{
        console.log(req.params.id)
        try {
            let resultPostProfile = await dbQuery(`select p.idposting, p.images, p.caption,p.add_date, x.username as user_name_post, x.images as avatar
            from newposting p left join users x on x.idusers = p.user_id where x.idusers = ${req.params.id}`)
            res.status(200).send(resultPostProfile)
        } catch (error) {
            console.log(error)
            
        }
    }
    



};
