const { v4: uuidv4 } = require('uuid');
const Url = require('../models/Url');


const leerUrls = async(req, res) => { 
    console.log(req.user)
    try{
        const urls = await Url.find({user:req.user.id}).lean();
        res.render('home',{url: urls});
    }catch (error){
        // console.log(error)
        // res.send('Error')
        req.flash('mensajes',[{msg:err.message}]);
        return res.redirect('/');
    }


};

const agergarURL = async(req, res) => {
    // console.log(req.body)
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

const editarUrlForm = async(req, res) => {
    const { id } = req.params;
    try{
        const url =await Url.findById(id).lean();
        if (!url.user.equals(req.user.id)) {
            throw new Error('No tienes permisos para editar esta URL');
        }
        // console.log(url)
        res.render('home',{origin:url.origin, id:url._id});
    }
    catch (error){
        req.flash('mensajes',[{msg:error.message}]);
        return res.redirect('/');
    }
}

const editarUrl = async(req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    console.log(origin + id)
    try{
        await Url.findByIdAndUpdate(id,{origin:origin});
        res.redirect('/');
    }
    catch (error){
        req.flash('mensajes',[{msg:error.message}]);
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
