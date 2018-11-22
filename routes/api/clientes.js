var express = require('express');
var router = express.Router();

const Cliente = require('../../database/models/cliente');

/* GET Clientee. */
router.get('/', function (req, res, next) {

    Cliente.find().exec().then(docs => {
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
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        ci: req.body.ci,
    };

    var modelCliente = new Cliente(datos);
    modelCliente.save().then(
        res.json({
            message: "Cliente inseertado en la bd"
        })
    ).catch(err => {
        res.status(500).json({
            error: err
        })
    });

});

module.exports = router;