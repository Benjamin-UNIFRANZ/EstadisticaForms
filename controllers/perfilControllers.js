require('dotenv').config();
const formidable = require('formidable');
const Jimp = require('jimp'); 
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const User = require('../models/User');

// Configurar la autenticación de Google Drive
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUR_CLIENT_ID,
  process.env.YOUR_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Establecer las credenciales
oauth2Client.setCredentials({
  refresh_token: process.env.YOUR_REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function uploadFileToDrive(filePath, fileName) {
  const fileMetadata = {
    name: fileName,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] // ID de la carpeta en Google Drive
  };

  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath)
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, webContentLink'
  });

  return response.data;
}

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
            const tempFilePath = path.join(__dirname, `../temp/${req.user.id}${extension}`);

            fs.copyFileSync(file.filepath, tempFilePath);

            const image = await Jimp.read(tempFilePath); 
            await image.resize(200, 200).quality(60).writeAsync(tempFilePath);

            const driveResponse = await uploadFileToDrive(tempFilePath, `${req.user.id}${extension}`);

            const user = await User.findById(req.user.id);
            user.imagen = driveResponse.webContentLink;
            await user.save();

            fs.unlinkSync(tempFilePath); // Eliminar el archivo temporal

            req.flash('mensajes', [{ msg: 'Ya se subio la imagen' }]);
            return res.redirect('/perfil');
        } catch (error) {
            req.flash('mensajes', [{ msg: error.message }]);
            return res.redirect('/perfil');
        }
    });
};