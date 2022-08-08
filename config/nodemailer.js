const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'dummydaniel22@gmail.com',
        pass:'psrxinpgytuatwty'
    }
})

module.exports ={
    transport
}