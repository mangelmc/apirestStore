const mongoose = require('../connect');
const Schema = mongoose.Schema;

const clienteSchema = Schema({
    nombre: String,
    telefono: Number,
    ci: String,
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }

})

const cliente = mongoose.model('Cliente', clienteSchema);

module.exports = cliente;