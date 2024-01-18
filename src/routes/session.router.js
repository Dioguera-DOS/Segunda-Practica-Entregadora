const { Router } = require('express');
const usersModel = require('../dao/models/users.model');
const router = Router();
const crypto = require('crypto');
const passport = require('passport');


const { generateToken, auth, passportCall } = require('../utils')

// router.get('/github',passport.authenticate('github',{}), (req, res)=> {
// })
// router.get('/callbackGithub',passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req, res)=> {
// })
// router.get('/errorGithub',passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req, res)=> {
// })

// router.get("/pruebas", passport.authenticate('jwt', {session:false}), (req,res)=>{
//     res.send("PRUEBAS...!!!")
// })

// // app.get('/usuario', auth, (req,res)=>{
//     router.get('/usuario', passport.authenticate('jwt', {session:false}), (req,res)=>{
//     res.send("PRUEBAS...!!!")

// })

router.post('/login', async (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
        return res.redirect('/login?error=Complete todos los datos')
    }

    password = crypto.createHmac("sha256", "coderCoder123").update(password).digest("hex")

    let usuarios = await usersModel.find({ email, password })

    let usuario = usuarios.find(u => u.email === email && u.password === password)

    if (!usuario) {
        return res.redirect(`/login?error=credenciales invalidas!!!`)
    }

    //req.session.usuario = {nombre:usuarios.name, email:usuarios.email}
    let token = generateToken(usuarios)
    res.cookie("userCookie", token, { maxAge: 1000 * 60 * 60, httpOnly: true })
    return res.redirect("/perfil?message= User logueado con éxito")
})

router.post('/register', async (req, res) => {
    //let {name, email, password } = req.body
    let { first_name, last_name, email, rol, password, age } = req.body

    if (!first_name || !last_name || !email || !password) {
        return res.redirect('/register?error=Complete todos los datos')
    }

    let usuario = await usersModel.findOne({ email })

    console.log(usuario)

    if (usuario) {
        return res.redirect(`/register?error=Existen usuarios con email${email} en base de datos!!`)
    }

    password = crypto.createHmac("sha256", "coderCoder123").update(password).digest("hex")

    // usuario = {
    //     first_name, last_name, email, password, age,
    //     role: rol === "adm" ? "adm":"user"

    // }
    

    let users
    try {

        users = await usersModel.create({ first_name, last_name, email, role:rol === 'adm'?'adm':'user', password, age})
        console.log(users)
        res.redirect(`/login?message=Usuario ${email} registro correctamente`)

    } catch (error) {
        console.log(error.message)
        res.redirect('/register?error=Error unexpected. Reload a fel minutes!!')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.redirect('/login?error=fallo en el logout!!!')
        }
    })

    res.redirect('/login')
})


module.exports = router

