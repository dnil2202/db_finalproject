const {dbConf, dbQuery}=require('../config/db');
const {hashPassword, createToken}=require('../confiG/encript')
const { transport } = require('../config/nodemailer');
const fs = require('fs')


module.exports={
    getData:async (req,res)=>{
        try {
            // let dataUser = await dbQuery(`Select * from users u JOIN status s on u.status_id = s.idstatus;`)
            let filter=[]
            for (const key in req.query) {
                filter.push(`${key}=${dbConf.escape(req.query[key])}`)
            }
            let dataUser = `Select * from users u JOIN status s on u.status_id = s.idstatus
            ${filter.length === 0 ?'':`where ${filter.join('AND')}`};`
            result = await dbQuery(dataUser)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            console.log('===============================================')
            
            res.status(500).send(error)
        }


            

       

    },

    register:async(req,res)=>{
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
                        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #deeafa;color: #000000">

  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #deeafa;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  
<table id="u_content_text_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:60px 30px 20px;font-family:'Raleway',sans-serif;" align="left">
        
  <div class="v-text-align" style="line-height: 160%; text-align: justify; word-wrap: break-word;">
  <img style="height:100px" src="https://cdn.dribbble.com/users/946315/screenshots/10829471/media/c5aaa5f4bed31b330293ad9044a453f6.png"/>
    <p style="font-size: 14px; line-height: 160%;"><strong><span style="font-size: 18px; line-height: 28.8px;">Selamat Datang!</span></strong></p>

<p style="font-size: 14px; line-height: 160%;"><br />Dear <strong>${fullname}</strong></p>
<p style="font-size: 14px; line-height: 160%;">Welcome to Guild</p>
<p style="font-size: 14px; line-height: 160%;"><br />Please confirm your email address by clicking the button below.</p>
  </div>
      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_button_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Raleway',sans-serif;" align="left">
        
<div class="v-text-align" align="center">
    <a href="${process.env.FE_URL}/verification/${token}" target="_blank" class="v-size-width" style="box-sizing: border-box;display: inline-block;font-family:'Raleway',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #001847; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:28%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
      <span  style="display:block;padding:10px 20px;line-height:120%;">Verified Account</span>
    </a>
  </div>
</div>
    </div>
  </div>
</div>
    </td>
  </tr>
  </tbody>
  </table>
</body>
                        </div>`
                    })
                    setTimeout(()=>{
                        res.status(200).send({
                            success: true,
                            message: 'Register Success',
                            token
                        })
                    },1000)
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

    login:async(req,res)=>{
        try {
            let {email,password}=req.body

            let loginUser = await dbQuery(`Select u.idusers, u.fullname, u.username,u.bio, u.email, u.images, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
            WHERE ${dbConf.escape(email).includes('@') && dbConf.escape(email).includes('.co') ?`u.email = ${dbConf.escape(email)}`: 
            `u.username = ${dbConf.escape(email)}`} 
            and u.password=${dbConf.escape(hashPassword(password))}`)
            
            if(loginUser.length >0){
                let token = createToken({...loginUser[0]})
                if(loginUser[0].status === 'Verified'){
                    let resultsPost =await dbQuery(`Select u.idusers, p.idposting, p.images, p.caption, p.add_date from users u JOIN posting p ON u.idusers = p.user_id
                    WHERE u.idusers = ${dbConf.escape(loginUser[0].idusers)};`)

                    let resultsLike = await dbQuery(`Select u.idusers, u.username,l.id,l.postId from users u join likes l on l.userId = u.idusers
                    Where u.idusers = ${dbConf.escape(loginUser[0].idusers)};`)
                    setTimeout(()=>{
                        res.status(200).send({
                               ...loginUser[0],
                               posting:resultsPost,
                               like:resultsLike,
                               token
                           })
                    },3000)
                }else{
                    let resultsPost =await dbQuery(`Select u.idusers, p.idposting, p.images, p.caption, p.add_date from users u JOIN posting p ON u.idusers = p.user_id
                    WHERE u.idusers = ${dbConf.escape(loginUser[0].idusers)};`)
                    await dbQuery(`UPDATE users set token=${dbConf.escape(token)} WHERE idusers=${dbConf.escape(loginUser[0].idusers)}`)

                    let resultsLike = await dbQuery(`Select u.idusers, u.username,l.id,l.postId from users u join likes l on l.userId = u.idusers
                    Where u.idusers = ${dbConf.escape(loginUser[0].idusers)};`)
                    setTimeout(()=>{
                        res.status(200).send({
                            status : 'Unverified',
                               ...loginUser[0],
                               posting:resultsPost,
                               like:resultsLike,
                               token
                           })
                    },3000)
                }
            }else{
                res.status(500).send({
                    status:false,
                    message:`The username you entered doesn't belong to an account. Please check your username and try again.`
                })
            }
        } catch (error) {
            console.log('ERROR QUERY SQL :', error);
            res.status(500).send(error)
        }
    },

    keepLogin:async (req,res)=>{
        try {
            let resultsUser = await dbQuery(`Select u.idusers, u.fullname, u.username, u.bio, u.email, u.images, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
            WHERE u.idusers=${dbConf.escape(req.dataToken.idusers)}`)

            if(resultsUser.length >0){
               let resultsPost = await dbQuery(`Select u.idusers, p.idposting, p.images, p.caption, p.add_date from users u JOIN posting p ON u.idusers = p.user_id
                WHERE u.idusers = ${dbConf.escape(resultsUser[0].idusers)};`)

                let resultsLike = await dbQuery(`Select u.idusers, u.username,l.id,l.postId from users u join likes l on l.userId = u.idusers
                Where u.idusers = ${dbConf.escape(resultsUser[0].idusers)};`)
                
                let token = createToken({...resultsUser[0]})
                res.status(200).send({
                    ...resultsUser[0],
                    posting:resultsPost,
                    like:resultsLike,
                    token
                })
            }
        } catch (error) {
            console.log('ERROR QUERY SQL :', error);
            res.status(500).send(error)
        }
    },

    verification : async(req,res)=>{
        let isToken = await dbQuery(`SELECT * FROM users where token =${dbConf.escape(req.token)}`)
        try {
            if(isToken.length > 0){
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
                        })
                    }
                }
        }else{
            await dbQuery(`UPDATE users set status_id=1 WHERE idusers=${dbConf.escape(req.dataToken.idusers)}`)
            let resultUser = await dbQuery(`Select u.idusers, u.fullname, u.username, u.email,u.token, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
            Where idusers = ${dbConf.escape(req.dataToken.idusers)}
            `)
            if(resultUser[0].token){
                res.status(500).send({
                    success: false,
                    message: "Email has been expired",
                    code:'EMAIL_EXPIRED'
                });
            }else{
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
            let sqlInsert = await dbQuery(`Select idusers, email,token, status_id  From users WHERE email =${dbConf.escape(email)}`)
            console.log(sqlInsert[0])
            console.log('===================================DISISNI')
                // Mengirimkan Email
                await transport.sendMail({
                    from :'SOSMED ADMIN',
                    to:sqlInsert[0].email,
                    subject:'verification email account',
                    html:`<div>
                    <h3> Click Link below</h3>
                    <a href='${process.env.FE_URL}/verification/${sqlInsert[0].token}'>Verified Account</a>
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
            let availableUsername = await dbQuery(`Select username from users where username = ${dbConf.escape(data.username)}`)
            let isName = await dbQuery(`Select username from users where idusers = ${req.params.id}`)
            if(availableUsername.length<=0 || data.username === isName[0].username){
                let dataInput = []
                for (const key in data) {
                    dataInput.push(`${key}=${dbConf.escape(data[key])}`)
                }
                if(req.files .length>0){
                    dataInput.push(`images =${dbConf.escape(`/img_profile${req.files[0].filename}`)}`)
                    await dbQuery(`UPDATE users set ${dataInput.join(',')}where idusers =${req.params.id}`)
                }else{
                    await dbQuery(`UPDATE users set ${dataInput.join(',')}where idusers =${req.params.id}`)
                }
                    let resultsUser = await dbQuery(`Select u.idusers, u.fullname, u.username, u.bio, u.email, u.images, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
                     WHERE u.idusers=${req.params.id}`)

                   let resultsPost = await dbQuery(`Select u.idusers, p.idposting, p.images, p.caption, p.add_date from users u JOIN posting p ON u.idusers = p.user_id
                    WHERE u.idusers = ${dbConf.escape(resultsUser[0].idusers)};`)
    
                    let resultsLike = await dbQuery(`Select u.idusers, u.username,l.id,l.postId from users u join likes l on l.userId = u.idusers
                    Where u.idusers = ${dbConf.escape(resultsUser[0].idusers)};`)
                    
                    let token = createToken({...resultsUser[0]})
                    // console.log({...resultsUser[0],post:resultsPost,like:resultsLike, token})
                    // console.log('================================================ POST')
                    res.status(200).send({
                    ...resultsUser[0],
                    posting:resultsPost,
                    like:resultsLike,
                    token
                })
            }else{
                res.status(500).send({
                    success:false,
                    message:'Username has been used'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}