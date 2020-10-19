var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        try {
            fs.statSync('./public/uploads');
        } catch (e) {
            fs.mkdirSync('./public/uploads');
        }

        cb(null, './public/uploads');
    },
    filename: (res, file, cb) => {

        cb(null, 'IMG-' + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        return cb(null, true);
    }
    return cb(new Error('Solo se admiten imagenes png y jpg jpeg'));
}

const upload = multer({
    storage: storage,
    //fileFilter: fileFilter,
    /*limits: {
        fileSize: 1024 * 1024 * 5
    }*/
})

const Menu = require('../../database/models/menu');

/* GET Menue. */
router.get('/', function (req, res, next) {

    Menu
        .find()
        .exec()
        .then(docs => {
            if (docs.length == 0) {
                res.json({
                    message: "No se encontro en la base de datos"
                })
            } else {
                res.json({
                    result: docs
                });
            }
        }).catch(err => {
            res.json({
                error: err
            });
        })

});
router.get('/:id', function (req, res, next) {
    let idMenu = req.params.id;

    Menu
        .findOne({
            _id: idMenu
        })
        .exec()
        .then(doc => {
            if (doc == undefined) {
                res.json({
                    message: "No se encontro en la base de datos"
                })
            } else {
                res.json(doc);
            }
        }).catch(err => {
            res.json({
                error: err
            });
        })

});

router.post('/', upload.single("img"), function (req, res, next) {

    let url = req.file.path.substr(6, req.file.path.length);
    const datos = {
        nombre: req.body.nombre,
        //telefono: req.body.telefono,
        foto: url,
        descripcion: req.body.descripcion,
        restaurant: req.body.restaurant,
        precio: req.body.precio,
    };

    var modelMenu = new Menu(datos);
    modelMenu.save()
        .then(result => {
            res.json({
                message: "Menu insertado en la bd",
                id: result._id
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });

});

router.patch('/:id', function (req, res, next) {
    let idMenu = req.params.id;
    const datos = {};

    Object.keys(req.body).forEach((key) => {
        datos[key] = req.body[key];
    });
    console.log(datos);
    Menu.findByIdAndUpdate(idMenu, datos).exec()
        .then(result => {
            res.json({
                message: "Datos actualizados"
            });
        }).catch(err => {
            res.status(500).json({
                error: err.message
            })
        });
});

router.delete('/:id', function (req, res, next) {
    let idMenu = req.params.id;

    Menu.findByIdAndRemove(idMenu).exec()
        .then(() => {
            res.json({
                message: "Menu eliminado"
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });


});

module.exports = router;