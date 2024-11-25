const mongoose = require('mongoose');
const Survey = require('../models/survey'); // Modelo de encuesta
const User = require('../models/User');


const leerSurvey = async (req, res) => {
    console.log(req.user)
    try {
        const user = await User.findById(req.user.id);
        return res.render('Form', { user: req.user, imagen: user.imagen });
    } catch (error) {
        req.flash('mensajes', [{ msg: 'Error al leer el usuario' }]);
        return res.redirect('/');
    }

};



// Controlador para crear una encuesta
const createSurvey = async (req, res) => {
    const userId = req.user.id; // Asumiendo que el ID del usuario está disponible en req.user

    // Obtener el nombre de usuario
    const user = await User.findById(userId);
    if (!user) {
        req.flash('mensajes', [{ msg: 'Usuario no encontrado' }]);
        return res.redirect('/');
    }
    const userName = user.userName; // Asumiendo que el nombre de usuario está disponible en user.username

    // Nombre de la colección basado en el nombre del usuario
    const collectionName = `survey_${userName}`;

    // Verificar si la colección ya existe
    const existingCollection = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();

    if (existingCollection.length === 0) {
        // Crear una nueva colección si no existe
        await mongoose.connection.db.createCollection(collectionName);
    }

    // Añadir el campo `user` a req.body
    req.body.user = userId;

    // Verificar que el campo `title` esté presente en req.body
    if (!req.body.title) {
        req.flash('mensajes', [{ msg: 'El campo título es obligatorio' }]);
        return res.redirect('/');
    }

    // Guardar la encuesta en la colección del usuario
    const SurveyModel = mongoose.model(collectionName, Survey.schema);
    const newSurvey = new SurveyModel(req.body); // Crear una nueva instancia de la encuesta, es decir un objeto dentro de collectionName
    console.log(req.body)
    try {
        await newSurvey.save();
        res.redirect('/')
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
};



const tuFormularioRoutes = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const userName = user.userName; // Asumiendo que el nombre de usuario está disponible en user.username

        // Nombre de la colección basado en el nombre del usuario
        const collectionName = `survey_${userName}`;

        // Buscar todos los formularios en la colección específica del usuario
        const SurveyModel = mongoose.model(collectionName, Survey.schema);
        const surveys = await SurveyModel.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();

        if (!surveys) {
            return res.status(404).send('Formularios no encontrados');
        }

        // Añadir la imagen del usuario a cada encuesta
        surveys.forEach(survey => {
            survey.imagen = user.imagen;
        });

        return res.render('tuFormulario', { 
            user: req.user, 
            imagen: user.imagen,
            surveys: surveys
        });
    } catch (error) {
        req.flash('mensajes', [{ msg: 'Error al leer los formularios' }]);
        return res.redirect('/');
    }
};


// Ruta para manejar el envío del formulario
const editarTuFormulario = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener el nombre de usuario desde las variables locales
        const userName = res.locals.user.userName; // Asumiendo que el nombre de usuario está disponible en res.locals.user

        // Nombre de la colección basado en el nombre del usuario
        const collectionName = `survey_${userName}`;

        // Buscar el formulario por su ID en la colección específica del usuario
        const SurveyModel = mongoose.model(collectionName, Survey.schema);
        const survey = await SurveyModel.findById(id).lean();

        // Verificar que el usuario tiene permisos para editar el formulario
        if (!survey.user.equals(req.user.id)) {
            throw new Error('No tienes permisos para editar este formulario');
        }


        // Renderizar el formulario de edición con los datos del formulario
        res.render('home', { survey, userName: userName });
    } catch (error) {
        // Manejar errores y redirigir con un mensaje flash
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
};

module.exports = {
    createSurvey,
    leerSurvey,
    tuFormularioRoutes,
    editarTuFormulario
};