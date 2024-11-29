const { v4: uuidv4 } = require('uuid');
const Url = require('../models/Url');


const leerUrls = async(req, res) => { 
    try {
        // Detectar el navegador
        const userAgent = req.headers['user-agent'];
        let confNavegador = false;
        if (userAgent.includes('Chrome') || userAgent.includes('Safari')) {
            confNavegador = true;
        }
        const urls = await Url.find({ user: req.user.id }).lean();
        res.render('home', { url: urls, confNavegador: confNavegador });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
};

const agergarURL = async(req, res) => {
    // console.log(req.body)
    // Extrae la propiedad 'origin' del objeto 'req.body' y la asigna a la constante 'origin'
    const { origin } = req.body;   
    
    try{
        // 3. Usar uuid para generar un identificador único
        const url = new Url({ origin:origin, shortURL: uuidv4(), user:req.user.id });
        // console.log(url)
        // res.send('Recibido')
        req.flash('mensajes',[{msg:'URL agregada'}]);
        await url.save()
        res.redirect('/');
    }catch (error){
        req.flash('mensajes',[{msg:err.message}]);
        return res.redirect('/');
    }
 }

 const eliminarURL = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error('No tienes permisos para eliminar esta URL');
        }
        await Url.findByIdAndDelete(id);
        req.flash('mensajes', [{ msg: 'URL eliminada' }]);
        return res.redirect('/');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}
// const editarUrl = async(req, res) => {
//     const { id } = req.params;
//     try{
//         const url =await Url.findById(id).lean();
//         res.render('home',{url});
//     }
//     catch (error){
//         console.log(error)
//         res.send('Error')
//     }
// }

// Controlador para mostrar el formulario de edición de una URL
const editarUrlForm = async(req, res) => {
    const { id } = req.params;
    try {
        // Buscar la URL por su ID
        const url = await Url.findById(id).lean();
        // Verificar que el usuario tiene permisos para editar la URL
        if (!url.user.equals(req.user.id)) {
            throw new Error('No tienes permisos para editar esta URL');
        }
        // Renderizar el formulario de edición con los datos de la URL
        res.render('home', { origin: url.origin, id: url._id });
    } catch (error) {
        // Manejar errores y redirigir con un mensaje flash
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

// Controlador para procesar la edición de una URL
const editarUrl = async(req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    console.log(origin + id)
    try {
        // Actualizar la URL con el nuevo origen
        await Url.findByIdAndUpdate(id, { origin: origin });
        // Redirigir a la página principal
        res.redirect('/');
    } catch (error) {
        // Manejar errores y redirigir con un mensaje flash
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}


const redireccionamiento =  async (req,res)=>{
    const {shortURL} = req.params
    console.log(shortURL)
    try{
        const urlDB = await Url.findOne({shortURL:shortURL})
        return res.redirect(urlDB.origin)
        // console.log(urlDB)
        // if (!urlDB) {
        //     console.log("No se encontró un documento con shortURL:", shortURL);
        //     return res.send('Error: URL no encontrada');
        // }

        // res.redirect(urlDB.origin)
    }catch(error){
        req.flash('mensajes',[{msg:'No existe la URL configurada'}]); 
        return res.redirect('/auth/login');
    }
}

module.exports = {
    leerUrls,
    agergarURL,
    eliminarURL,
    editarUrlForm,
    editarUrl,
    redireccionamiento
}
