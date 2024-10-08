const express = require('express');
const session = require('express-session');
const {create} = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/User');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const helmet = require('helmet'); // Asegúrate de instalar helmet
const cors = require('cors');

require('dotenv').config();

const clientBD = require('./database/db');


const path = require('path');
const app = express();

app.use (cors());
const corsOptions = {
    // origin: 'http://localhost:3000',
    // optionsSuccessStatus: 200
    credentilas: true,
    origin: process.env.PATHHEROKU || '*',
    methods : ['GET', 'POST'],

};
app.use(cors(corsOptions));

// Middleware para analizar cookies
app.use(cookieParser()); // Línea 17: Añadido middleware cookie-parser

// Middleware para analizar datos del formulario
app.use(express.urlencoded({ extended: true })); // Línea 20: Añadido middleware express.urlencoded

app.use(session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: 'session-user',
    cookie: {
        secure: process.env.MODO === 'production' ,
        maxAge: 4 * 60 * 60 * 1000 // 4 horas en milisegundos
    },
    store: MongoStore.create({
        clientPromise: clientBD,
        dbName: process.env.DBNAME,
    }),
}));


app.use(flash());

app.use(csrf({ cookie: true }));


app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash('mensajes'); // mensajes es el nombre de la variable de sesion lo configuramos de manera global
    next();
});


app.use(passport.initialize());
app.use(passport.session());

//autentificacion
passport.serializeUser((user, done) => {
    done(null, {id: user.id, userName: user.userName});
} );
passport.deserializeUser(async(user, done) => {
    const UserDB = await User.findById(user.id);
    return done(null, {id: UserDB.id, userName: UserDB.userName});
} );


// Configurar Content-Security-Policy con Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
            styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net", "http://localhost:3000","https://qzzzc0qgcnodzpo2.public.blob.vercel-storage.com"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    }
}));


// Configurar Content-Security-Policy con Helmet

app.get('/mensajeFlash', (req, res) => { 
    // console.log(req.flash('mensajet')); //entonces flash solo se puede usar una vez
    res.json(req.flash('mensajet'));
} );

app.get('/enviarMensajeFlash', (req, res) => {
    req.flash('mensajet', 'mensaje flash');
    res.redirect('/mensajeFlash');
}   );

// app.get('/rutaProtegida', (req, res) => {
//     res.json(req.session.usuario || 'No hay usuario logeado');
// } );

// app.get('/crearSession', (req, res) => {
//     req.session.usuario = 'usuario';
//     res.redirect('/rutaProtegida');
// } );

// app.get('/eliminarSession', (req, res) => {
//     req.session.destroy();
//     res.redirect('/rutaProtegida');
// } );


const hbs = create({
    extname: '.hbs',
    partialsDir: ["views/components"],
});




app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // Corrige la ruta del directorio de vistas

// Define routes before serving static files
// app.use(express.urlencoded({ extended: true })); //esto va arriba de las rutas
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));



const PORT = process.env.PORT || 3000;
app.listen(3000, () => {console.log('Server is running on port', PORT);});


