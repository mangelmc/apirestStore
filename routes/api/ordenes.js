var express = require('express');
var router = express.Router();

const Orden = require('../../database/models/orden');

/* GET Ordene. */
router.get('/', function (req, res, next) {

    Orden.find().exec().then(docs => {
        if (docs.length == 0) {
            res.json({
                message: "No se encontro en la base de datos"
            })
        } else {
            res.json(docs);
        }
    }).catch(err => {
        res.json({
            error: err
        });
    })

});

router.post('/', function (req, res, next) {
    const datos = {
        cliente: req.body.idCliente,
        lugarEnvio: req.body.lugarEnvio,
        restaurant: req.body.idRestaurant,

        menus: req.body.menus,
        cantidad: req.body.cantidad,
        precios: req.body.precios,
    };

    let precios = req.body.precios;
    let cantidad = req.body.cantidad;

    let pagoTotal = 0;
    for (let index = 0; index < precios.length; index++) {
        pagoTotal += precios[index] * cantidad[index];
    };
    datos.cantidad = cantidad;
    datos.pagoTotal = pagoTotal;

    var modelOrden = new Orden(datos);
    modelOrden.save().then(
        res.json({
            message: "Orden insertado en la bd"
        })
    ).catch(err => {
        res.status(500).json({
            error: err
        })
    });

});

module.exports = router;