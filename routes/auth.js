const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const { loginForm, registerLoginForm, registerUser, confirmarCuenta, loginUser, cerrarSesion } = require('../controllers/authController');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const { google } = require('googleapis');
require('dotenv').config();

// Configurar la autenticación de Google OAuth 2.0
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUR_CLIENT_ID,
  process.env.YOUR_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

router.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // Guarda el refresh token en tu base de datos o en el archivo .env
  console.log('Refresh Token:', tokens.refresh_token);
  res.redirect('/perfil'); // Redirige al perfil después de la autenticación
});

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