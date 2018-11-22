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
        idCliente: req.body.idCliente,
        lugarEnvio: req.body.lugarEnvio,
        idRestaurant: req.body.idRestaurant,
        telefono: req.body.telefono,
        idMenu: req.body.idMenu,
        cantidad: req.body.cantidad,
        pagoTotal: req.body.pagoTotal,
    };

    var modelOrden = new Orden(datos);
    modelOrden.save().then(
        res.json({
            message: "Orden inseertado en la bd"
        })
    ).catch(err => {
        res.status(500).json({
            error: err
        })
    });

});

module.exports = router;