const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const app = express();

const hbs = create({
    extname: '.hbs',
    partialsDir: ["views/components"],
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // Corrige la ruta del directorio de vistas

// Define routes before serving static files
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});