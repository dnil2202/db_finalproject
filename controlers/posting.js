const {dbConf,dbQuery}=require('../config/db');
const fs = require('fs')

module.exports={
    getDataPosting : async (req,res)=>{
        try {
            let result = await dbQuery(`Select u.idusers, u.username, p.idposting, p.images, p.caption, p.add_date from users u JOIN posting p ON u.idusers = p.user_id`)
            res.status(200).send(result)
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }
    },

    postPosting:async (req,res)=>{
        try {
            // console.log(req.body);
            // console.log(req.files);
            let data = JSON.parse(req.body.data)
            // Proses data ke mysql
            let dataInput = []
        for (const prop in data){
            dataInput.push(dbConf.escape(data[prop]));
        }
        console.log(dataInput)
        dataInput.splice(0,0,dbConf.escape(`/image_posting${req.files[0].filename}`))
        console.log('After',dataInput)
        let addData = await dbQuery(`INSERT INTO POSTING (images,caption,user_id)values (${dataInput.join(',')})`);
        res.status(200).send({
            success :true,
            message:'Add Posting Success'
        })
        } catch (error) {
            console.log(error)
            // Menghapus gagal ketika upload
            fs.unlinkSync(`./public/image_posting/${req.files[0].filename}`)
            res.status(500).send(error)
            
        }
        
        
    },
}