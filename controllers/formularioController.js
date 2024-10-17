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



module.exports = {
    createSurvey,
    leerSurvey
};