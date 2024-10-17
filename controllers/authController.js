const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 
require('dotenv').config();

// Renderiza el formulario de inicio de sesión
const loginForm = (req, res) => {
    res.render("login");
}

// Renderiza el formulario de registro
const registerLoginForm = (req, res) => {
    res.render("register");
}

// Registra un nuevo usuario
const registerUser = async (req, res) => {
    // Validar los datos del formulario
    const errors = validationResult(req);
    // Verificar si hay errores de validación
    if (!errors.isEmpty()) {
        // Si hay errores, enviar los mensajes de error a la vista
        req.flash('mensajes', errors.array());
        // Redirigir al formulario de registro
        return res.redirect('/auth/register');
    }

    const { userName,  password, passwordConfirmation } = req.body;
    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({userName: userName });
        if (user) throw new Error('Usuario ya existe');

        // Crear un nuevo usuario
        user = new User({ userName, password }); //, tokenConfirm: uuidv4() });
        await user.save();

        //Ya no usamos nodemailer

        //  Enviar correo electrónico de confirmación
        // const transport = nodemailer.createTransport({
        //     host: "sandbox.smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //         user: process.env.userEmail,
        //         pass: process.env.passEmail
        //     }
        // });

        // await transport.sendMail({
        //     from: '"Fred Foo 👻" <foo@example.com>',
        //     to: user.email,
        //     subject: "Verifique cuenta de correo",
        //     html: `<a href="${process.env.VERCEL || "http://localhost:3000"}/auth/confirmarCuenta/${user.tokenConfirm}">Verificar cuenta aquí</a>`,
        // });

        req.flash('mensajes', [{ msg: 'Usuario registrado' }]); //Sin utilidad por ahora
        return res.redirect('/auth/login');
    } catch (err) {
        req.flash('mensajes', [{ msg: err.message }]);
        return res.redirect('/auth/register');
    }
}

// // Confirma la cuenta del usuario
// const confirmarCuenta = async (req, res) => {
//     const { token } = req.params;
//     try {
//         const user = await User.findOne({ tokenConfirm: token });
//         if (!user) throw new Error('Usuario no encontrado');

//         user.cuentaConfirmada = true;
//         user.tokenConfirm = null;
//         await user.save();

//         req.flash('mensajes', [{ msg: 'Cuenta verificada, puedes iniciar sesión' }]);
//         res.redirect('/auth/login');
//     } catch (error) {
//         res.json({ error: error.message });
//     }
// }

// Inicia sesión del usuario
const loginUser = async (req, res) => {
    const errors = validationResult(req); // Validar los datos del formulario
    if (!errors.isEmpty()) { // Verificar si hay errores de validación
        req.flash('mensajes', errors.array()); // Si hay errores, enviar los mensajes de error a la vista
        return res.redirect('/auth/login'); // Redirigir al formulario de inicio de sesión
    }

    const { userName, password } = req.body; // Extraer email y contraseña del cuerpo de la solicitud
    try {
        const user = await User.findOne({ userName }); // Buscar el usuario por usuario
        if (!user) throw new Error('Usuario no encontrado'); // Si el usuario no es encontrado, lanzar un error

        // if (!user.cuentaConfirmada) throw new Error('Falta confirmar cuenta'); // Si la cuenta del usuario no está confirmada, lanzar un error (comentado por ahora)
        
        if (!(await user.comparePassword(password))) throw new Error('Contraseña incorrecta'); // Comparar la contraseña proporcionada con la contraseña almacenada en hash

        req.login(user, function (err) { // Iniciar sesión del usuario
            if (err) throw new Error('Error al iniciar sesión'); // Si hay un error durante el inicio de sesión, lanzar un error
            return res.redirect('/'); // Redirigir a la página principal después de iniciar sesión con éxito
        });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]); // Si hay un error, enviar el mensaje de error a la vista
        return res.redirect('/auth/login'); // Redirigir al formulario de inicio de sesión
    }
}

// Cierra la sesión del usuario
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
    // confirmarCuenta,
    loginUser,
    cerrarSesion
}
