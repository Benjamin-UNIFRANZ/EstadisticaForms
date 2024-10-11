// middlewares/globalVariables.js
const User = require('../models/User');

const addGlobalVariables = async (req, res, next) => {
    if (req.user) {
        try {
            const user = await User.findById(req.user.id);
            res.locals.user = req.user;
            res.locals.imagen = user.imagen;
        } catch (error) {
            console.error('Error al leer el usuario:', error);
            req.flash('mensajes', [{ msg: 'Error al leer el usuario' }]);
        }
    }
    next();
};

module.exports = addGlobalVariables;