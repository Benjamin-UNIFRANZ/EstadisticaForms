const mongoose = require('mongoose');
const { Schema } = mongoose;

const surveySchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imagen: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [{
        tituloPregunta: {
            type: String,
            required: true
        },
        tipoRespuesta: {
            type: {
                type: String,
                enum: ['opcion_multiple', 'respuesta_abierta'],
                required: true
            },
            input: {
                opciones: [String]
            },
            placeholder: String
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Survey', surveySchema);
