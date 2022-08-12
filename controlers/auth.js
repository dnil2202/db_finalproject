const {dbConf, dbQuery}=require('../config/db');
const {hashPassword, createToken}=require('../confiG/encript')
const { transport } = require('../config/nodemailer');
const fs = require('fs')


module.exports={
    getData:(req,res)=>{
        dbConf.query(`Select * from users u JOIN status s on u.status_id = s.idstatus;`, 
        (err,results)=>{
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            console.log('Result sql',results)
            res.status(200).send(results)
        })
    },

    register:async(req,res)=>{
        console.log(req.body)
        try {
            let {fullname, username, email, password}=req.body;
            let availableEmail = await dbQuery(`Select email from users where email = ${dbConf.escape(email)}`)
            let availableUsername = await dbQuery(`Select username from users where username = ${dbConf.escape(username)}`)
            console.log('email',availableEmail.length)
            if(availableEmail.length <= 0 && availableUsername  <=0 ){
                let sqlInsert = await dbQuery(`INSERT INTO USERS (fullname,username,email,password)
                values(${dbConf.escape(fullname)},${dbConf.escape(username)},
                ${dbConf.escape(email)},${dbConf.escape(hashPassword(password))});`)
                if(sqlInsert.insertId){
                    let sqlGet=await dbQuery(`Select idusers, email, status_id from users where idusers=${sqlInsert.insertId}`)
                    // Generate Token
                    let token = createToken({...sqlGet[0]}, '1h')
                    // Mengirimkan Email
                    await transport.sendMail({
                        from :'SOSMED ADMIN',
                        to:sqlGet[0].email,
                        subject:'verification email account',
                        html:`<div>
                        <h3> Click Link below</h3>
                        <a href='${process.env.FE_URL}/verification/${token}'>Verified Account</a>
                        </div>`
                    })
                    res.status(200).send({
                        success: true,
                        message: 'Register Success'
                    })
                }
            }
            else{
                res.status(401).send({
                    success : false,
                    message:'Email or Username used'
                })
                
            }
        } catch (error) {
            console.log('Error query SQL :', error);
            res.status(500).send(error);
        }
    },

    login:(req,res)=>{
        console.log(req.body)
        let {email,password}=req.body
        console.log('req ',password)
        dbConf.query(`Select u.idusers, u.fullname, u.username, u.email, u.images, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
        WHERE ${dbConf.escape(email).includes('@') && dbConf.escape(email).includes('.co')?`u.email = ${dbConf.escape(email)} or u.username =''`: 
        `u.username = ${dbConf.escape(email)} or u.email=''` } 
        and u.password=${dbConf.escape(hashPassword(password))}`, (err,results)=>{
            if(err){
                console.log('Error SQL:', err)
                res.status(500).send(err)
            }
            dbConf.query(`Select u.idusers, p.idposting, p.images, p.caption, p.add_date from users u JOIN posting p ON u.idusers = p.user_id
            WHERE u.idusers = ${dbConf.escape(results[0].idusers)};`, (errPost,resultsPost)=>{
                if(errPost){
                    console.log('ERROR QUERY SQL :', errPost);
                    res.status(500).send(errPost)
                }
                let token = createToken({...results[0]})
                res.status(200).send({
                    ...results[0],
                    posting:resultsPost,
                    token
                })
            })
            console.log(results[0].idusers)
        })

    },

    keepLogin:async (req,res)=>{
        try {
            let resultsUser = await dbQuery(`Select u.idusers, u.fullname, u.username, u.email, u.images, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
            WHERE u.idusers=${dbConf.escape(req.dataToken.idusers)}`)

            if(resultsUser.length >0){
               let resultsPost = await dbQuery(`Select u.idusers, p.idposting, p.images, p.caption, p.add_date from users u JOIN posting p ON u.idusers = p.user_id
                WHERE u.idusers = ${dbConf.escape(resultsUser[0].idusers)};`)
                
                let token = createToken({...resultsUser[0]})
                res.status(200).send({
                    ...resultsUser[0],
                    posting:resultsPost,
                    token
                })
            }
        } catch (error) {
            console.log('ERROR QUERY SQL :', error);
            res.status(500).send(error)
        }
    },

    verification : async(req,res)=>{
        try {
            if(req.dataToken.idusers){
                // update status user
                await dbQuery(`UPDATE users set status_id=1 WHERE idusers=${dbConf.escape(req.dataToken.idusers)}`)
                // proses login
                let resultUser = await dbQuery(`Select u.idusers, u.fullname, u.username, u.email, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
                Where idusers = ${dbConf.escape(req.dataToken.idusers)}
                `)
                if(resultUser.length > 0){
                    // 3. login berhasil, maka buar token baru
                    let token = createToken({...resultUser[0]})
                    res.status(200).send({
                        success :true,
                        message:'Login Success',
                        dataLogin :{
                            ...resultUser[0],
                            token
                        },
                        error:''
                    })
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: false,
                message: "Failed ❌",
                error
            });
        }
    },

    resendEmail : async(req,res)=>{
        try {
            let {email}=req.body;
            let sqlInsert = await dbQuery(`Select idusers, email, status_id  From users WHERE email =${dbConf.escape(email)}`)
            console.log(sqlInsert)
                // Generate Token
                let token = createToken({...sqlInsert[0]}, '1h')
                // Mengirimkan Email
                await transport.sendMail({
                    from :'SOSMED ADMIN',
                    to:sqlInsert[0].email,
                    subject:'verification email account',
                    html:`<div>
                    <h3> Click Link below</h3>
                    <a href='${process.env.FE_URL}/verification/${token}'>Verified Account</a>
                    </div>`
                })
                res.status(200).send({
                    success: true,
                    message: 'Register Success'
                })
            
        } catch (error) {
            console.log('Error query SQL :', error);
            res.status(500).send(error);
        }
    },

    editProfile: async(req,res)=>{
        try {
            let data = JSON.parse(req.body.data)
            let dataInput = []
            for (const key in data) {
                dataInput.push(`${key}=${dbConf.escape(data[key])}`)
            }
            dataInput.push(`images =${dbConf.escape(`/img_profile${req.files[0].filename}`)}`)
            console.log('data',dataInput.join(','))
            await dbQuery(`UPDATE users set ${dataInput.join(',')}where idusers =${req.params.id}`)
            res.status(200).send({
                success:true,
                message:'Picture Uploaded'
            })
        } catch (error) {
            console.log(error)
        }
    }
}