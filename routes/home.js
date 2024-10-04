const express = require('express');
const { leerUrls, agergarURL, eliminarURL, editarUrlForm, editarUrl, redireccionamiento } = require('../controllers/homeControlles');
const urlVa = require('../middlewares/urlValidar');
const verficarUser = require('../middlewares/verificarUser');
const csrf = require('csurf');
const { formPerfil, editarPerfil } = require('../controllers/perfilControllers'); // Importar correctamente
const csrfProtection = csrf({ cookie: true });

const router = express.Router();

router.get('/', verficarUser, leerUrls);
router.post('/', verficarUser, csrfProtection, urlVa, agergarURL);
router.get('/eliminar/:id', verficarUser, eliminarURL);
router.get('/editar/:id', verficarUser, editarUrlForm);
router.post('/editar/:id', verficarUser, csrfProtection, urlVa, editarUrl);

router.get('/perfil', verficarUser, formPerfil); // Usar el controlador correctamente
router.post('/perfil', verficarUser, csrfProtection, editarPerfil); // Asegurar protección CSRF y verificación de usuario

router.get('/:shortURL', redireccionamiento);

module.exports = router;