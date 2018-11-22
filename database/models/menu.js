const mongoose = require('../connect');
const Schema = mongoose.Schema;

const menuSchema = Schema({

    nombre: String,
    precio: Number,
    descripcion: String,
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },
    foto: String
})

const menu = mongoose.model('Menu', menuSchema);

module.exports = menu;