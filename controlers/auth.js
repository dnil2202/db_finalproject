const {dbConf, dbQuery}=require('../config/db');
const {hashPassword, createToken}=require('../confiG/encript')


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
    register:(req,res)=>{
        console.log(req.body)
        let {fullname, username, email, password}=req.body
        dbConf.query(`INSERT INTO USERS (fullname,username,email,password)
        values(${dbConf.escape(fullname)},${dbConf.escape(username)},
        ${dbConf.escape(email)},${dbConf.escape(hashPassword(password))});`,
        (err,results)=>{
            if (err) {
                console.log('Error query SQL :', err);
                res.status(500).send(err);
            }

            res.status(200).send({
                success: true,
                message: 'Register Success'
            })
        })

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
    }

}