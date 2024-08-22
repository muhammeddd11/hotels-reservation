const status = require('statuses')
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });

const globalErorr = (err , req , res , next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    if(process.env.NODE_ENV ==="development"){
        sendErorrForDev(err , res)
    }else{
        sendErorrForProd(err , res)
    }
}

const sendErorrForDev = (err  , res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message : err.message,
        error : err,
        stack : err.stack
    })
}


const sendErorrForProd = (err  , res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message : err.message,
    })
}



module.exports = globalErorr