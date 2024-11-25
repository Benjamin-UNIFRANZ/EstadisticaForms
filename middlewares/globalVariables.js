// middlewares/globalVariables.js
const User = require('../models/User');

const addGlobalVariables = async (req, res, next) => {
    if (req.user) {
        try {
            const user = await User.findById(req.user.id);
            res.locals.user = req.user; // Agrega el usuario autenticado a las variables locales
            res.locals.imagen = user.imagen; // Agrega la imagen del usuario a las variables locales
        } catch (error) {
            console.error('Error al leer el usuario:', error);
            req.flash('mensajes', [{ msg: 'Error al leer el usuario' }]);
        }
    }
    next();
};

module.exports = addGlobalVariables;