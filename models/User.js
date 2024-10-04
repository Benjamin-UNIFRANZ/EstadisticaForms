const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
const userSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    tokenConfirm: {
        type: String,
        required: false,
        default: null
    },
    cuentaConfirmada: {
        type: Boolean,
        // required: true,
        default: false
    },
    imagen: {
        type: String,
        required: false,
        default: null
    }
});

userSchema.pre('save', async function (next){
    const user = this;
    if(!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(user.password, salt);
        
        user.password = passwordHash;
        next();
    } catch (error) {
        // Validar si es que falta la encriptacion de la contraseña
        console.log(error);
        throw new Error('Error en la encriptacion de la contraseña');
    }
} )
userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password, this.password);
}


module.exports = mongoose.model('User', userSchema);