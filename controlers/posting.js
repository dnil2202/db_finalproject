const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getDataPosting: async (req, res) => {
        try {
            let resultPost = await dbQuery(`select p.idposting, p.images, p.caption,p.add_date, x.username as user_name_post, x.images as avatar
            from posting p left join users x on x.idusers = p.user_id;`);

            let postComments = await Promise.all(resultPost.map(async(post)=>{
                let comment = await dbQuery(`select c.idcomment,c.posting_id,comment,u.fullname as user_name_comment from comment c left join users u on u.idusers=c.user_comment_id where posting_id = ${post.idposting}`);
                if(comment.length > 0){
                    post['comment']= comment 
                }
                return post
            })) 

            let postCommentsLikes = await Promise.all(postComments.map(async(postCom)=>{
                let getLikes = await dbQuery(`select l.id, l.postId, u.fullname as user_name_likes from likes l left join users u on u.idusers=l.userId where postId = ${postCom.idposting}`)
                if(getLikes.length > 0){
                    postCom['likes']= getLikes 
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
            // console.log(req.body);
            // console.log(req.files);
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
                `INSERT INTO POSTING (images,caption,user_id)values (${dataInput.join(
                    ',',
                )})`,
            );
            res.status(200).send({
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
                `DELETE from posting where idposting = ${req.params.id}`,
            );

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
            let newData = [];
            Object.keys(req.body).forEach((val) => {
                newData.push(`${val}=${dbConf.escape(req.body[val])}`);
            });
            await dbQuery(
                `UPDATE posting set ${newData.join(',')}where idposting=${
                    req.params.id
                }`,
            );
            res.status(200).send({
                success: true,
                message: 'Caption Updated',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
};
