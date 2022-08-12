const Crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports={
    hashPassword:(pass)=>{
        return Crypto.createHmac('sha256','SOSMED123').update(pass).digest('hex');
    },

    createToken :(payload,expiresIn='24h')=>{
        return jwt.sign(payload, 'sosmed',{
            expiresIn
        })
        
    },

    readToken :(req,res,next)=>{
        console.log('data token', req.token);
        jwt.verify(req.token,'sosmed',(err,decode)=>{
            if(err){
                return res.status(401).send({
                    message:'Authenticate error'
                })
            }
            console.log('Translate token', decode);
            req.dataToken = decode
            next()
        })
    }



}