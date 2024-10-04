const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');   
require('dotenv').config();

const loginForm = (req, res) => {
    // res.render("login", {
    //     mensajes: req.flash().mensajes,
    //     csrfToken: req.csrfToken(),
    // });
    res.render("login");

}

const registerLoginForm = (req, res) => {
    // res.render("register", {
    //     mensajes: req.flash().mensajes,
    //     csrfToken: req.csrfToken(),
    // });
    res.render("register");
}

const registerUser = async(req, res) => {2
    //validar los datos del formulario

    const erros = validationResult(req);
    if(!erros.isEmpty()){
        // req.flash('mensajes',erros.array());
        // return res.status(400).json({erros:erros.array()});
        req.flash('mensajes',erros.array());
        return res.redirect('/auth/register');
    }

    const { userName, email, password, passwordConfirmation } = req.body;
    try{
        let user = await User.findOne({ email:email})
        if(user) throw new Error('user existe');

        user = new User({userName,email,password,tokenConfirm:uuidv4()});
        console.log(user);
        await user.save();

        //enviar correo electronico con la confirmacion de la cuenta;
        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.userEmail,
                pass: process.env.passEmail
            }
        });

        await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: user.email,
            subject: "verifique cuenta de correo",
            html: `<a href="${process.env.SECRETSESSION || "http://localhost:3000"}/auth/confirmarCuenta/${user.tokenConfirm}">verificar cuenta aquí</a>`,
        });
        req.flash('mensajes',[{msg:'Usuario registrado, verifica tu correo'}]);

        return res.redirect('/auth/login');
        // res.json(user);
    }catch(err){
        req.flash('mensajes',[{msg:err.message}]);
        return res.redirect('/auth/register');
    }

}
const confirmarCuenta = async(req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({tokenConfirm:token});
        if(!user) throw new Error('Usuario no encontrado');

        user.cuentaConfirmada = true;
        user.tokenConfirm = null;
        await user.save();
        req.flash('mensajes',[{msg:'Cuenta verificada, puedes iniciar secion'}]);


        res.redirect('/auth/login');
    }catch(error){
        res.json({error:error.menssaje});
    }
}
 
const loginUser = async(req, res) => {
    const erros = validationResult(req);
    if(!erros.isEmpty()){
        req.flash('mensajes',erros.array());
        return res.redirect('/auth/login');
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email})

        if(!user) throw new Error('Usuario no encontrado');
        if(!user.cuentaConfirmada) throw new Error('falta confirmar cuenta');

        if(!(await user.comparePassword(password)))
            throw new Error('contraseña incorrecta');

        req.login(user,function(err){
            if(err) throw new Error('Error al iniciar sesion');
            return res.redirect('/');
        });
    }
    catch(error){
        // res.send({error:error.menssaje});
        req.flash('mensajes',[{msg:error.message}]);
        return res.redirect('/auth/login');
    }
}
const cerrarSesion = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
}



module.exports = {  
    loginForm,
    registerLoginForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion
}