const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const { loginForm, registerLoginForm, registerUser, confirmarCuenta, loginUser, cerrarSesion } = require('../controllers/authController');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/register', registerLoginForm);
router.post('/register', csrfProtection, [
    body('userName', 'Ingrese un nombre de usuario').trim().notEmpty().escape(),
    body('email', 'Ingrese un correo valido').trim().isEmail().normalizeEmail(),
    body('password', 'Ingrese una contraseña minimo de 6 caracteres').trim().isLength({ min: 6 }).escape().custom((value, { req }) => {
        if (value !== req.body.passwordConfirmation) {
            throw new Error('Las contraseñas no coinciden');
        } else {
            return value;
        }
    }),
], registerUser);
router.get('/confirmarCuenta/:token', confirmarCuenta);
router.get('/login', loginForm);
router.post('/login', csrfProtection,
    body('email', 'Ingrese un correo valido').trim().isEmail().normalizeEmail(),
    body('password', 'Ingrese una contraseña minimo de 6 caracteres').trim().isLength({ min: 6 }).escape(),
    loginUser);

router.get('/logout', cerrarSesion);
module.exports = router;