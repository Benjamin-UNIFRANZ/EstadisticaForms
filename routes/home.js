const addGlobalVariables = require('../middlewares/globalVariables'); // Importar el middleware
const express = require('express');
const csrf = require('csurf');
const urlVa = require('../middlewares/urlValidar');
const { 
    leerUrls, 
    agergarURL, 
    eliminarURL, 
    editarUrlForm, 
    editarUrl, 
    redireccionamiento 
} = require('../controllers/homeControlles');
const verficarUser = require('../middlewares/verificarUser');
const { 
    formPerfil, 
    editarPerfil, 
    listarBlobs 
} = require('../controllers/perfilControllers'); // Importar correctamente
const {
    createSurvey, 
    leerSurvey,
    tuFormularioRoutes,
    editarTuFormulario
}= require('../controllers/formularioController');

const csrfProtection = csrf({ cookie: true });
const router = express.Router();


// survey routes
// Survey routes


router.get('/', verficarUser,addGlobalVariables, leerUrls);
router.post('/', verficarUser, addGlobalVariables,csrfProtection, urlVa, agergarURL);

//Creacion de formularios
router.get('/crearFormulario', verficarUser, csrfProtection,leerSurvey);
router.post('/crearFormulario', verficarUser, csrfProtection,createSurvey);


router.get('/eliminar/:id', verficarUser,addGlobalVariables, eliminarURL);
router.get('/editar/:id', verficarUser,addGlobalVariables, editarUrlForm);
router.post('/editar/:id', verficarUser,addGlobalVariables, csrfProtection, urlVa, editarUrl);

router.get('/perfil', verficarUser, formPerfil); // Usar el controlador correctamente
router.post('/perfil', verficarUser, csrfProtection, editarPerfil); // Asegurar protección CSRF y verificación de usuario


// Rutas para mostrar y enviar el formulario
router.get('/tuFormulario', verficarUser, tuFormularioRoutes);
router.get('/editarFormulario/:id', verficarUser,addGlobalVariables, editarTuFormulario);

router.get('/listar-blobs', verficarUser, listarBlobs); // Nueva ruta para listar blobs


router.get('/:shortURL', redireccionamiento);

module.exports = router;