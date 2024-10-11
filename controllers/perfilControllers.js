const formidable = require('formidable');
const Jimp = require('jimp'); 
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { put } = require('@vercel/blob');
const axios = require('axios'); // Asegúrate de tener axios instalado
const Url = require('../models/Url');
require('dotenv').config();





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
            const blobName = `${req.user.id}${extension}`;
            const containerName = 'perfiles';

            // Procesar la imagen con Jimp
            const image = await Jimp.read(file.filepath);
            await image.resize(200, 200).quality(60).writeAsync(file.filepath);

            // Subir la imagen procesada al blob
            const processedData = fs.readFileSync(file.filepath);
            const { url: processedUrl } = await put(`perfiles/${blobName}`, processedData, { access: 'public' });

            const user = await User.findById(req.user.id);
            user.imagen = processedUrl;
            await user.save();
            console.log(user.imagen)
            req.flash('mensajes', [{ msg: 'Ya se subio la imagen' }]);
            return res.redirect('/perfil');
        } catch (error) {
            req.flash('mensajes', [{ msg: error.message }]);
            return res.redirect('/perfil');
        }
    });
};

// Nueva función para listar blobs en el contenedor
module.exports.listarBlobs = async (req, res) => {
    try {
        const response = await axios.get('https://api.vercel.com/v2/blobs/perfiles', {
            headers: {
                Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
            }
        });
        const blobs = response.data;
        res.json(blobs);
    } catch (error) {
        res.status(500).send(`Error listing blobs: ${error.message}`);
    }
};