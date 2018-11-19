const mongoose = require('../connect');
const Schema = mongoose.Schema;

const ordenSchema = Schema({

    idCliente: Schema.Types.ObjectId,
    lugarEnvio: [Number],
    idRestaurant: Schema.Types.ObjectId,
    telefono: Number,
    idMenu: [Schema.Types.ObjectId],
    cantidad: [Number],
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },
    pagoTotal: String

})

const Orden = mongoose.model('Orden', ordenSchema);

module.exports = Orden;