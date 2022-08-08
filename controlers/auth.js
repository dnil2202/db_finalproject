const {dbConf, dbQuery}=require('../config/db');
const {hashPassword, createToken}=require('../confiG/encript')
const { transport } = require('../config/nodemailer');


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

        } catch (error) {
            console.log('Error query SQL :', error);
            res.status(500).send(error);
        }
    },
    login:(req,res)=>{
        console.log(req.body)
        let {email,password}=req.body
        console.log('req ',password)
        dbConf.query(`Select u.idusers, u.fullname, u.username, u.email, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
        WHERE u.email = ${dbConf.escape(email)}
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
            let resultsUser = await dbQuery(`Select u.idusers, u.fullname, u.username, u.email, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
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
                
            }else {
                res.status(401).send({
                    success: false,
                    messages: "Verify Failed ❌",
                    dataLogin: {},
                    error: ""
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: false,
                message: "Failed ❌",
                error
            });
        }
    }

}