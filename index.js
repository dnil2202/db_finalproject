const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors')
const PORT=process.env.PORT;
const bearerToken = require('express-bearer-token')




// untuk bisa redirect public
app.use(express.static('public'))
//

app.use(express.json())
app.use(cors())
app.use(bearerToken())

app.get('/api',(req,res)=>{
    res.status(200).send('<h1>API SOSMED</h1>')
})

// DB Check Connection
const{dbConf}= require('./config/db')
dbConf.getConnection((err,connection)=>{
    if(err){
        console.log('Error MYSQL', err.sqlMessage);
    }
    console.log(`connect: ${connection.threadId}`);
})

// Config Routers
const{authRouter, postingRouter,commentRouter,likeRouter}=require('./routers');
app.use('/api/auth', authRouter)
app.use('/api/posting',postingRouter)
app.use('/api/comment',commentRouter)
app.use('/api/like',likeRouter)

// app.use("/api/product",product)

app.listen(PORT,()=>console.log(`Running SOSMED API at ${PORT}`));