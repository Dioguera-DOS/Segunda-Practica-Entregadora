const passport = require('passport');
const jwt = require('jsonwebtoken');
const SRECRETKEY = '********'

//strategy swt con local storage.

const generateToken = (usuarios) =>jwt.sign({usuarios}, SRECRETKEY, {expiresIn:"1h"})

//midlleware authorizate
const auth = (req, res, next)=>{
    if(!req.headers.authorization){
        res.setHeader('Content-Type', 'application/json');
        //return res.status(401).json({error:`user not autenticate`})      
        return res.redirect('/login?error=user not autenticated')

    }
    let token = req.headers.authorization.split(" ")[1]
    try {
        
        let user = jwt.verify(token, SRECRETKEY)
        req.usuario = user
        next()
    } catch (error) {
        return res.status(401).json({error});
        
    }
} 

//strategy passport jwb con cookie
const passportCall = (strategy) => {
    return async(req, res, next)=>{
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err);
            if(!user){
                return res.status(401).send({error:info.messages?info.messages:info.toString()})
            }

            req.user = user;
            next()
        })(req,res,next)

    }
}

module.exports = {passportCall, SRECRETKEY, generateToken, auth}