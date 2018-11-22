const mongoose = require('../connect');
const Schema = mongoose.Schema;

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'debe poner un nombre']
    },
    telefono: Number,
    email: {
        type: String,
        required: 'Falta el email',
        //match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,

    },
    ci: {
        type: String,
        required: [true, 'Falta el CI']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },
    avatar: String,
});




const usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = usuario;