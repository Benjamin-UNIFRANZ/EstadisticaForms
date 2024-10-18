// Importar módulos necesarios
const express = require('express');
const session = require('express-session');
const { create } = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/User');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const clientBD = require('./database/db');

// Inicializar la aplicación Express
const app = express();

// Configurar CORS
const corsOptions = {
    credentials: true,
    origin: process.env.PATHHEROKU || '*',
    methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));

// Middleware para analizar cookies
app.use(cookieParser());

// Middleware para analizar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: process.env.SECRETSESSION, // Clave secreta para firmar la cookie de la sesión
    resave: false, // No guardar la sesión si no ha sido modificada
    saveUninitialized: false, // No guardar una sesión que no ha sido inicializada
    name: 'session-user', // Nombre de la cookie de la sesión
    cookie: {
         secure: process.env.MODO === 'production', // Habilitar solo en producción para HTTPS
        maxAge: 4 * 60 * 60 * 1000 // 4 horas en milisegundos
    },
    store: MongoStore.create({
        clientPromise: clientBD, // Conexión a la base de datos MongoDB
        dbName: process.env.DBNAME, // Nombre de la base de datos
        collectionName: 'mySessions', // Nombre de la colección de sesiones
    }),
}));

// Middleware para mensajes flash
app.use(flash()); // Permite el uso de mensajes flash para notificaciones temporales

// Middleware CSRF
app.use(csrf({ cookie: true })); // Protección contra ataques CSRF usando cookies

// Middleware para configurar variables locales
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Añadir el token CSRF a las variables locales
    res.locals.mensajes = req.flash('mensajes'); // Añadir mensajes flash a las variables locales
    next(); // Continuar con el siguiente middleware
});

// Inicializar Passport
app.use(passport.initialize()); // Inicializar Passport para la autenticación
app.use(passport.session()); // Usar sesiones de Passport

// Configuración de Passport para la autenticación
passport.serializeUser((user, done) => {
    done(null, { id: user.id, userName: user.userName }); // Serializar el usuario en la sesión
});
passport.deserializeUser(async (user, done) => {
    const UserDB = await User.findById(user.id); // Buscar el usuario en la base de datos
    return done(null, { id: UserDB.id, userName: UserDB.userName }); // Deserializar el usuario de la sesión
});

// Configurar Content-Security-Policy con Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com",
                "'unsafe-inline'"
            ],
            styleSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://use.fontawesome.com",
                "https://cdnjs.cloudflare.com",
                "'unsafe-inline'"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https://cdn.jsdelivr.net",
                "http://localhost:3000",
                "https://qzzzc0qgcnodzpo2.public.blob.vercel-storage.com"
            ],
            connectSrc: ["'self'"],
            fontSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://use.fontawesome.com",
                "https://cdnjs.cloudflare.com"
            ],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    }
}));

// Rutas para mensajes flash
app.get('/mensajeFlash', (req, res) => {
    res.json(req.flash('mensajet'));
});

app.get('/enviarMensajeFlash', (req, res) => {
    req.flash('mensajet', 'mensaje flash');
    res.redirect('/mensajeFlash');
});


// Configuración de Handlebars
const hbs = create({
    extname: '.hbs', // Extensión de archivo para las plantillas de Handlebars
    partialsDir: ["views/components"], // Directorio donde se encuentran los parciales (subplantillas)
});

app.engine('.hbs', hbs.engine); // Configura Handlebars como el motor de plantillas para archivos con extensión .hbs
app.set('view engine', '.hbs'); // Establece Handlebars como el motor de plantillas predeterminado
app.set('views', path.join(__dirname, 'views')); // Establece el directorio donde se encuentran las vistas (plantillas)

// Definir rutas antes de servir archivos estáticos
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar la carpeta 'assets' para servir archivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
