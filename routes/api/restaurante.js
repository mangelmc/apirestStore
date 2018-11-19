var express = require('express');
var router = express.Router();

const Restaurant = require('../../database/models/restaurant');

/* GET restaurante. */
router.get('/', function (req, res, next) {

    Restaurant.find().exec().then(docs => {
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
        nit: req.body.nit,
        propietario: req.body.propietario,
        calle: req.body.calle,
        log: req.body.log,
        lat: req.body.lat,
        logo: req.body.logo,
        fotoLugar: req.body.fotoLugar
    }

    var data = new Restaurant(datos);
    data.save().then(
        res.json({
            message: "Restaurant inseertado en la bd"
        })
    ).catch(err => {
        res.status(500).json({
            error: err
        })
    });

});

module.exports = router;