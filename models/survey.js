const mongoose = require('mongoose');
const { Schema } = mongoose;

const surveySchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['open', 'closed'],
            required: true
        }
    }]
});

module.exports = mongoose.model('Survey', surveySchema);