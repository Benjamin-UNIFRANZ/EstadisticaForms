const mongose = require('mongoose');
require('dotenv').config();

const clientBD = mongose
    .connect(process.env.URI)
    .then((m) => {
        console.log('Database connected');
        return m.connection.getClient();
    })
    .catch(err => console.log(err));

    module.exports = clientBD;