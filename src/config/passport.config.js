// //const local = require('passport-local');
// const github = require('passport-github2')
//const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const SECRETKEY = require('../utils')
//const usersModel = require('../dao/models/users.model');



const buscaToken=(req)=>{
    let token=null

    if(req.cookies.userCookie){
        token=req.cookies.userCookie
    }

    return token
}

const initPassport=()=>{

    passport.use("jwt", new passportJWT.Strategy(
        {
            secretOrKey:SECRETKEY,
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscaToken])
        },
        async(contenidoToken , done)=>{
            try {
                if(contenidoToken.nombre==="Romina"){
                    return done(null, false, {message:"El usuario tiene el acceso temporalmente restringido", detalle:"Contacte al administrador"})
                }

                console.log("Passport...!!!")
                return done(null, contenidoToken)
            } catch (error) {
                return done(error)
            } 
        }
    ))
    
}

module.exports = {initPassport}



















