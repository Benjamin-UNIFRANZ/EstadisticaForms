const formidable = require('formidable');
const Jimp = require('jimp'); 
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

module.exports.formPerfil = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        return res.render('perfil', { user: req.user, imagen: user.imagen });
    } catch (error) {
        req.flash('mensajes', [{ msg: 'Error al leer el usuario' }]);
        return res.redirect('/perfil');
    }
};

module.exports.editarPerfil = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.maxFileSize = 5 * 1024 * 1024; // 5MB

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                if (err.message.includes('maxFileSize exceeded')) {
                    req.flash('mensajes', [{ msg: 'La imagen es muy pesada, menos de 5MB' }]);
                    return res.redirect('/perfil');
                }
                req.flash('mensajes', [{ msg: 'Fallo la subida de imagen' }]);
                return res.redirect('/perfil');
            }

            const file = files.myFile;
            if (file.originalFilename === '') {
                req.flash('mensajes', [{ msg: 'Por favor suba una imagen' }]);
                return res.redirect('/perfil');
            }

            if (!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
                req.flash('mensajes', [{ msg: 'Solo se permiten imagenes jpg o png' }]);
                return res.redirect('/perfil');
            }

            if (file.size > 5 * 1024 * 1024) {
                req.flash('mensajes', [{ msg: 'La imagen es muy pesada, menos de 5MB' }]);
                return res.redirect('/perfil');
            }

            const extension = path.extname(file.originalFilename);
            const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}${extension}`);

            fs.copyFileSync(file.filepath, dirFile);

            const image = await Jimp.read(dirFile); 
            await image.resize(200, 200).quality(60).writeAsync(dirFile);

            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}${extension}`;
            await user.save();

            req.flash('mensajes', [{ msg: 'Ya se subio la imagen' }]);
            return res.redirect('/perfil');
        } catch (error) {
            req.flash('mensajes', [{ msg: error.message }]);
            return res.redirect('/perfil');
        }
    });
};