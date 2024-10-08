const axios = require('axios');
require('dotenv').config();

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN no está definido en el archivo .env');
}

const instance = axios.create({
    baseURL: 'https://qzzzc0qgcnodzpo2.public.blob.vercel-storage.com',
    headers: { 'Authorization': `Bearer ${token}` }
});

module.exports = instance;