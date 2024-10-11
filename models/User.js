const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
const userSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: { unique: true } //Crea un índice único en la base de datos para el campo userName
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: false,
        // index: { unique: true }
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

// Middleware que se ejecuta antes de guardar un documento de usuario
userSchema.pre('save', async function (next) {
    const user = this; // Referencia al documento de usuario actual

    if (!user.isModified('password')) return next(); // Si la contraseña no ha sido modificada, continuar sin hacer nada

    try {
        const salt = await bcrypt.genSalt(10); // Generar una sal (salt) con un factor de costo de 10
        const passwordHash = await bcrypt.hash(user.password, salt); // Encriptar la contraseña del usuario utilizando la sal generada
        user.password = passwordHash; // Reemplazar la contraseña del usuario con la versión encriptada
        next(); // Continuar con el siguiente middleware o la operación de guardado
    } catch (error) {
        console.log(error); // Si ocurre un error durante la encriptación, imprimir el error
        throw new Error('Error en la encriptación de la contraseña'); // Lanzar una excepción
    }
});

// Método para comparar una contraseña proporcionada con la contraseña encriptada almacenada
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password); // Comparar la contraseña proporcionada con la contraseña encriptada
}

module.exports = mongoose.model('User', userSchema);