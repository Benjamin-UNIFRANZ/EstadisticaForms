const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Controladores
const {
    loginForm, // Muestra el formulario de inicio de sesión
    registerLoginForm, // Muestra el formulario de registro
    registerUser, // Registra un nuevo usuario
    // confirmarCuenta, // Confirma la cuenta del usuario
    loginUser, // Inicia sesión del usuario
    cerrarSesion // Cierra la sesión del usuario
} = require('../controllers/authController');

// Validaciones
const userNameValidation = body('userName', 'Ingrese un nombre de usuario')
    .trim() // Elimina espacios en blanco al inicio y al final
    .notEmpty() // Verifica que no esté vacío
    .escape(); // Escapa caracteres especiales

    //Ya no validamos Email
// const emailValidation = body('email', 'Ingrese un correo valido')
//     .trim() // Elimina espacios en blanco al inicio y al final
//     .isEmail() // Verifica que sea un correo válido
//     .normalizeEmail(); // Normaliza el correo

const passwordValidation = body('password', 'Ingrese una contraseña minimo de 6 caracteres')
    .trim() // Elimina espacios en blanco al inicio y al final
    .isLength({ min: 6 }) // Verifica que tenga al menos 6 caracteres
    .escape(); // Escapa caracteres especiales

const passwordConfirmationValidation = body('password').custom((value, { req }) => {
    if (value !== req.body.passwordConfirmation) {
        throw new Error('Las contraseñas no coinciden'); // Verifica que las contraseñas coincidan
    }
    return value;
});

// Rutas
// Ruta para mostrar el formulario de registro
router.get('/register', registerLoginForm);

// Ruta para registrar un nuevo usuario con protección CSRF y validaciones
router.post('/register', csrfProtection, [
    userNameValidation,
    // emailValidation,
    passwordValidation,
    passwordConfirmationValidation
], registerUser);

// Ruta para confirmar la cuenta del usuario
// router.get('/confirmarCuenta/:token', confirmarCuenta); //Utilizaremos mas adelante el tokenconfirm para usarlo como link de verificacion de autirizacion para ver los forms de otros usuarios

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', loginForm);

// Ruta para iniciar sesión con protección CSRF y validaciones
router.post('/login', csrfProtection, [
    // emailValidation,
    passwordValidation
], loginUser);

// Ruta para cerrar sesión
router.get('/logout', cerrarSesion);

module.exports = router;