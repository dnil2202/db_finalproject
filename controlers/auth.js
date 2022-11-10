const {dbConf, dbQuery}=require('../config/db');
const {hashPassword, createToken}=require('../confiG/encript')
const { transport } = require('../config/nodemailer');


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
                        <body style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;padding:0;Margin:0"> 
                        <div class="es-wrapper-color" style="background-color:#EEEEEE"><!--[if gte mso 9]>
                                  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                      <v:fill type="tile" color="#eeeeee"></v:fill>
                                  </v:background>
                              <![endif]--> 
                         <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
                           <tr style="border-collapse:collapse"> 
                            <td valign="top" style="padding:0;Margin:0"> 
                             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td align="left" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:15px"><!--[if mso]><table style="width:580px" cellpadding="0" cellspacing="0"><tr><td style="width:282px" valign="top"><![endif]--> 
                                     <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td align="left" style="padding:0;Margin:0;width:282px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td class="es-infoblock es-m-txt-c" align="left" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica\ neue', helvetica, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px">Put your preheader text here<br></p></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table><!--[if mso]></td><td style="width:20px"></td><td style="width:278px" valign="top"><![endif]--> 
                                     <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td align="left" style="padding:0;Margin:0;width:278px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td class="es-infoblock es-m-txt-c" align="right" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px"><a  class="view" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#CCCCCC;font-size:12px;font-family:arial, 'helvetica neue', helvetica, sans-serif">View in browser</a></p></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table><!--[if mso]></td></tr></table><![endif]--></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table> 
                             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                               <tr style="border-collapse:collapse"></tr> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#044767;width:600px" cellspacing="0" cellpadding="0" bgcolor="#044767" align="center"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td align="left" style="Margin:0;padding-top:35px;padding-bottom:35px;padding-left:35px;padding-right:35px"><!--[if mso]><table style="width:530px" cellpadding="0" cellspacing="0"><tr><td style="width:340px" valign="top"><![endif]--> 
                                     <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:340px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;padding-bottom:15px"><h1 style="Margin:0;line-height:72px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:36px;font-style:normal;font-weight:bold;color:#ffffff">GUILD</h1></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table><!--[if mso]></td><td style="width:20px"></td><td style="width:170px" valign="top"><![endif]--> 
                                     <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                       <tr class="es-hidden" style="border-collapse:collapse"> 
                                        <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:170px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td style="padding:0;Margin:0;padding-bottom:5px;font-size:0" align="center"> 
                                             <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                               <tr style="border-collapse:collapse"> 
                                                <td style="padding:0;Margin:0;border-bottom:1px solid #044767;background:#FFFFFF none repeat scroll 0% 0%;height:1px;width:100%;margin:0px"></td> 
                                               </tr> 
                                             </table></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td style="padding:0;Margin:0"> 
                                             <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                               <tr style="border-collapse:collapse"> 
                                                <td align="center" style="padding:0;Margin:0;display:none"></td> 
                                               </tr> 
                                             </table></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table><!--[if mso]></td></tr></table><![endif]--></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table> 
                             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td style="Margin:0;padding-bottom:35px;padding-left:35px;padding-right:35px;padding-top:40px;background-color:#f7f7f7" bgcolor="#f7f7f7" align="left"> 
                                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td valign="top" align="center" style="padding:0;Margin:0;width:530px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td style="Margin:0;padding-top:20px;padding-bottom:25px;padding-left:35px;padding-right:35px;font-size:0px" align="center"><a target="_blank"  style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#ED8E20;font-size:15px"><img src="https://avatars.githubusercontent.com/u/42573040?s=200&v=4" alt="ship" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="ship" width="150"></a></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td align="center" style="padding:0;Margin:0;padding-bottom:15px"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#333333">GUILD<br></h2></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td class="es-m-txt-l" align="left" style="padding:0;Margin:0;padding-top:20px"><h3 style="Margin:0;line-height:22px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;font-style:normal;font-weight:bold;color:#333333">Hello ${fullname},<br></h3></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td align="left" style="padding:0;Margin:0;padding-bottom:10px;padding-top:15px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:23px;color:#333333;font-size:15px">Welcome to Guild</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:23px;color:#333333;font-size:15px"><br>Please confirm your email address by clicking the button below.<br></p></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-bottom:20px;padding-top:25px"><span class="es-button-border" style="border-style:solid;border-color:transparent;background:#ed8e20;border-width:0px;display:inline-block;border-radius:5px;width:auto"><a href="${process.env.FE_URL}/verification/${token}" class="es-button es-button-1661256457075" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#ffffff;font-size:18px;border-style:solid;border-color:#ed8e20;border-width:15px 30px;display:inline-block;background:#ed8e20;border-radius:5px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center">CONFIRM</a></span></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table> 
                             <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-footer-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td align="left" style="Margin:0;padding-top:35px;padding-left:35px;padding-right:35px;padding-bottom:40px"> 
                                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td valign="top" align="center" style="padding:0;Margin:0;width:530px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td style="padding:0;Margin:0;padding-bottom:15px;font-size:0px" align="center"><img src="https://avatars.githubusercontent.com/u/42573040?s=200&amp;v=4" alt="Beretun logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="Beretun logo" width="37"></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#333333;font-size:14px"><strong>675 Massachusetts Avenue </strong></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#333333;font-size:14px"><strong>Cambridge, MA 02139</strong></p></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td esdev-links-color="#777777" class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-bottom:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#777777;font-size:14px">if your account is verified, please ignore this email or&nbsp;<u><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#777777;font-size:14px" class="unsubscribe" href="">unsubscribe</a></u>.</p></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table> 
                             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"> 
                                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                        </td> 
                                       </tr> 
                                     </table></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table> 
                        </div>  
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
            console.log(email)

            let loginUser = await dbQuery(`Select u.idusers, u.fullname, u.username,u.bio, u.email, u.images, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
            WHERE ${dbConf.escape(email).includes('@') && dbConf.escape(email).includes('.co') ?`u.email = ${dbConf.escape(email)}`: 
            `u.username = ${dbConf.escape(email)}`} 
            and u.password=${dbConf.escape(hashPassword(password))}`)
            
            if(loginUser.length >0){
                let token = createToken({...loginUser[0]})
                if(loginUser[0].status === 'Verified'){
                    let resultsPost =await dbQuery(`Select u.idusers,u.images as avatar, p.idposting,  u.username as user_name_post, p.images, p.caption, p.add_date from users u JOIN newposting p ON u.idusers = p.user_id
                    WHERE u.idusers = ${dbConf.escape(loginUser[0].idusers)};`)

                    let resultsLike = await dbQuery(`Select u.idusers,u.username,p.idposting,p.add_date,p.images,l.id,l.postId from users u JOIN likes l ON u.idusers=l.userId 
                    JOIN newposting p ON p.idposting = l.postId WHERE l.userId =${dbConf.escape(loginUser[0].idusers)};`)
                    setTimeout(()=>{
                        res.status(200).send({
                               ...loginUser[0],
                               posting:resultsPost,
                               like:resultsLike,
                               token
                           })
                    },3000)
                }else{
                    let resultsPost =await dbQuery(`Select u.idusers, p.idposting, u.username as user_name_post, p.images, p.caption, p.add_date from users u JOIN newposting p ON u.idusers = p.user_id
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
              let resultsPost =await dbQuery(`Select u.idusers,u.images as avatar, p.idposting,  u.username as user_name_post, p.images, p.caption, p.add_date from users u JOIN newposting p ON u.idusers = p.user_id
              WHERE u.idusers = ${dbConf.escape(resultsUser[0].idusers)};`)

                    let resultsLike = await dbQuery(`Select u.idusers,u.username,p.idposting,p.add_date,p.images,l.id,l.postId from users u JOIN likes l ON u.idusers=l.userId 
                    JOIN newposting p ON p.idposting = l.postId WHERE l.userId =${dbConf.escape(resultsUser[0].idusers)};`)
                
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
            let sqlInsert = await dbQuery(`Select idusers,fullname,email,token, status_id From users WHERE email =${dbConf.escape(email)}`)
                // Mengirimkan Email
                console.log(sqlInsert[0])
                await transport.sendMail({
                    from :'SOSMED ADMIN',
                    to:sqlInsert[0].email,
                    subject:'verification email account',
                    html:`<div>
                        <body style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;padding:0;Margin:0"> 
                        <div class="es-wrapper-color" style="background-color:#EEEEEE"><!--[if gte mso 9]>
                                  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                      <v:fill type="tile" color="#eeeeee"></v:fill>
                                  </v:background>
                              <![endif]--> 
                         <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
                           <tr style="border-collapse:collapse"> 
                            <td valign="top" style="padding:0;Margin:0"> 
                             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td align="left" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:15px"><!--[if mso]><table style="width:580px" cellpadding="0" cellspacing="0"><tr><td style="width:282px" valign="top"><![endif]--> 
                                     <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td align="left" style="padding:0;Margin:0;width:282px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td class="es-infoblock es-m-txt-c" align="left" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica\ neue', helvetica, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px">Put your preheader text here<br></p></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table><!--[if mso]></td><td style="width:20px"></td><td style="width:278px" valign="top"><![endif]--> 
                                     <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td align="left" style="padding:0;Margin:0;width:278px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td class="es-infoblock es-m-txt-c" align="right" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px"><a href="" class="view" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#CCCCCC;font-size:12px;font-family:arial, 'helvetica neue', helvetica, sans-serif">View in browser</a></p></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table><!--[if mso]></td></tr></table><![endif]--></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table> 
                             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                               <tr style="border-collapse:collapse"></tr> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#044767;width:600px" cellspacing="0" cellpadding="0" bgcolor="#044767" align="center"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td align="left" style="Margin:0;padding-top:35px;padding-bottom:35px;padding-left:35px;padding-right:35px"><!--[if mso]><table style="width:530px" cellpadding="0" cellspacing="0"><tr><td style="width:340px" valign="top"><![endif]--> 
                                     <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:340px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;padding-bottom:15px"><h1 style="Margin:0;line-height:72px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:36px;font-style:normal;font-weight:bold;color:#ffffff">GUILD</h1></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table><!--[if mso]></td><td style="width:20px"></td><td style="width:170px" valign="top"><![endif]--> 
                                     <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                       <tr class="es-hidden" style="border-collapse:collapse"> 
                                        <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:170px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td style="padding:0;Margin:0;padding-bottom:5px;font-size:0" align="center"> 
                                             <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                               <tr style="border-collapse:collapse"> 
                                                <td style="padding:0;Margin:0;border-bottom:1px solid #044767;background:#FFFFFF none repeat scroll 0% 0%;height:1px;width:100%;margin:0px"></td> 
                                               </tr> 
                                             </table></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td style="padding:0;Margin:0"> 
                                             <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                               <tr style="border-collapse:collapse"> 
                                                <td align="center" style="padding:0;Margin:0;display:none"></td> 
                                               </tr> 
                                             </table></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table><!--[if mso]></td></tr></table><![endif]--></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table> 
                             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td style="Margin:0;padding-bottom:35px;padding-left:35px;padding-right:35px;padding-top:40px;background-color:#f7f7f7" bgcolor="#f7f7f7" align="left"> 
                                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td valign="top" align="center" style="padding:0;Margin:0;width:530px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td style="Margin:0;padding-top:20px;padding-bottom:25px;padding-left:35px;padding-right:35px;font-size:0px" align="center"><a target="_blank"  style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#ED8E20;font-size:15px"><img src="https://avatars.githubusercontent.com/u/42573040?s=200&v=4" alt="ship" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="ship" width="150"></a></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td align="center" style="padding:0;Margin:0;padding-bottom:15px"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#333333">GUILD<br></h2></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td class="es-m-txt-l" align="left" style="padding:0;Margin:0;padding-top:20px"><h3 style="Margin:0;line-height:22px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;font-style:normal;font-weight:bold;color:#333333">Hello ${sqlInsert[0].fullname},<br></h3></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td align="left" style="padding:0;Margin:0;padding-bottom:10px;padding-top:15px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:23px;color:#333333;font-size:15px">Welcome to Guild</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:23px;color:#333333;font-size:15px"><br>Please confirm your email address by clicking the button below.<br></p></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-bottom:20px;padding-top:25px"><span class="es-button-border" style="border-style:solid;border-color:transparent;background:#ed8e20;border-width:0px;display:inline-block;border-radius:5px;width:auto"><a href="${process.env.FE_URL}/verification/${sqlInsert[0].token}" class="es-button es-button-1661256457075" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#ffffff;font-size:18px;border-style:solid;border-color:#ed8e20;border-width:15px 30px;display:inline-block;background:#ed8e20;border-radius:5px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center">CONFIRM</a></span></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table> 
                             <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-footer-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td align="left" style="Margin:0;padding-top:35px;padding-left:35px;padding-right:35px;padding-bottom:40px"> 
                                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td valign="top" align="center" style="padding:0;Margin:0;width:530px"> 
                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                           <tr style="border-collapse:collapse"> 
                                            <td style="padding:0;Margin:0;padding-bottom:15px;font-size:0px" align="center"><img src="https://avatars.githubusercontent.com/u/42573040?s=200&amp;v=4" alt="Beretun logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="Beretun logo" width="37"></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#333333;font-size:14px"><strong>675 Massachusetts Avenue </strong></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#333333;font-size:14px"><strong>Cambridge, MA 02139</strong></p></td> 
                                           </tr> 
                                           <tr style="border-collapse:collapse"> 
                                            <td esdev-links-color="#777777" class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-bottom:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#777777;font-size:14px">if your account is verified, please ignore this email or&nbsp;<u><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#777777;font-size:14px" class="unsubscribe" href="">unsubscribe</a></u>.</p></td> 
                                           </tr> 
                                         </table></td> 
                                       </tr> 
                                     </table></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table> 
                             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                               <tr style="border-collapse:collapse"> 
                                <td align="center" style="padding:0;Margin:0"> 
                                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                                   <tr style="border-collapse:collapse"> 
                                    <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"> 
                                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                       <tr style="border-collapse:collapse"> 
                                        <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                        </td> 
                                       </tr> 
                                     </table></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table> 
                        </div>  
                       </body>
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
                if(req.files.length>0){
                    dataInput.push(`images =${dbConf.escape(`/img_profile${req.files[0].filename}`)}`)
                    await dbQuery(`UPDATE users set ${dataInput.join(',')}where idusers =${req.params.id}`)
                }else{
                    await dbQuery(`UPDATE users set ${dataInput.join(',')}where idusers =${req.params.id}`)
                }
                    let resultsUser = await dbQuery(`Select u.idusers, u.fullname, u.username, u.bio, u.email, u.images, u.status_id, s.status from users u JOIN status s on u.status_id=s.idstatus
                     WHERE u.idusers=${req.params.id}`)

                   let resultsPost = await dbQuery(`Select u.idusers, p.idposting, p.images, p.caption, p.add_date from users u JOIN newposting p ON u.idusers = p.user_id
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
            }else{
                res.status(500).send({
                    success:false,
                    message:'Username has been used'
                })
            }
        } catch (error) {
            console.log(error)
        }
    },


}