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
        cliente: req.body.cliente,
        lugarEnvio: req.body.lugarEnvio,
        restaurant: req.body.restaurant,
        menus: req.body.menus,
    };

    let precios = req.body.precios;
    let cantidad = req.body.cantidad;
    let pagoTotal = 0;

    if (Array.isArray(cantidad) && Array.isArray(precios)) {
        for (let index = 0; index < precios.length; index++) {
            pagoTotal += +precios[index] * +cantidad[index];
            console.log(cantidad[index]);
        };
    } else {
        pagoTotal = +cantidad * +precios
    }
    //console.log(precios);
    datos.cantidad = cantidad;
    datos.pagoTotal = pagoTotal;
    //console.log(pagoTotal);

    var modelOrden = new Orden(datos);
    modelOrden.save()
        .then(result => {
            res.json({
                message: "Orden insertado en la bd"
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });

});
const PDFDocument = require('pdfkit');
const fs = require('fs');
var nodemailer = require('nodemailer'); // email sender function
router.get('/facturas/:id', function (req, res, next) {


    Orden.findById(req.params.id).populate('restaurant').populate('menus').populate('cliente').exec()
        .then(doc => {

            // Create a document 

            pdf = new PDFDocument

            let idOrden = req.params.id;
            let writeStream = fs.createWriteStream(idOrden + '.pdf');
            pdf.pipe(writeStream);
            // Add another page 

            pdf
                .fontSize(20)
                .text('Id de Factura : ' + idOrden, 100, 100)
                .moveDown()

            pdf.fontSize(12).text('Nombre o Razon Social ' + doc.cliente.nombre, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            pdf.text('Correo electronico : ' + doc.cliente.email, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            pdf.text('Cedula de Indentidad ' + doc.cliente.ci, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            //pdf.rect(pdf.x, 0, 410, pdf.y).stroke()


            pdf.text('Telefono :  ' + doc.cliente.nombre, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()

            pdf.text('DETALLE DE PEDIDO', {
                width: 412,
                align: 'center'
            })
            pdf.moveDown()
            pdf.text('Restaurant : ' + doc.restaurant.nombre, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            pdf.text('NIT : ' + doc.restaurant.nit, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            pdf.text('Direccion : ' + doc.restaurant.calle, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            pdf.text('Telefono : ' + doc.restaurant.telefono, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            //image
            /* pdf.image('out2.png', pdf.x, pdf.y, {
                width: 300
            }) */

            pdf.text('Nombre \n Precio \n Cantidad', {
                width: 412,
                height: 15,
                columns: 3,
                align: 'left'
            })
            pdf.moveTo(95, pdf.y)
                .lineTo(510, pdf.y).stroke()

            pdf.moveDown()
            console.log(pdf.x, pdf.y);
            pdf.rect(pdf.x - 5, pdf.y, 410, doc.menus.length * 20).stroke()

            for (let index = 0; index < doc.menus.length; index++) {
                //pdf.rect(pdf.x, pdf.y, 410, 15).stroke()
                pdf.text(doc.menus[index].nombre + '\n' + doc.menus[index].precio + '\n' + doc.cantidad[index], {
                    width: 412,
                    align: 'left',
                    height: 15,
                    columns: 3
                })
                pdf.moveDown()
            }
            pdf.text('Total :  ' + doc.pagoTotal, {
                width: 412,
                align: 'right'
            })
            pdf.moveDown()



            pdf.text('Fecha de venta : ' + doc.fechaRegistro.toString(), {
                width: 412,
                align: 'center'
            })
            pdf.moveDown()



            // Finalize PDF file 
            pdf.end()



            //pdf.pipe(res.status(201));

            //res.status(500).json();

            //enviar el pdf al correo del cliente .

            let config = JSON.parse(fs.readFileSync("config.json"))
            //console.log(config.password);

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {

                    user: 'maangelmcho@gmail.com', //su correo ,del que se enviara el email
                    pass: config.password //aqui va la contraseña de su correo

                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            var mailOptions = {
                from: 'Api Rest Store!',
                to: 'mangelmcho@gmail.com',
                subject: 'Factura por servicio',
                text: 'Adjuntamos la factura por servicio de comidas',
                attachments: [{
                    path: "./" + idOrden + ".pdf"
                }]
            };

            writeStream.on('finish', function () {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({
                            error: error
                        });
                    } else {


                        pdf = new PDFDocument;
                        let writeStreamG = fs.createWriteStream(idOrden + '.pdf');
                        pdfg.pipe(writeStreamG);
                       
                        pdfg.fontSize(20)
                            .text('Id de  : ' + idOrden, 100, 100)
                            .moveDown()

                        pdfg.fontSize(12).text('Nombre o Razon Social ' + doc.cliente.nombre, {
                            width: 412,
                            align: 'left'
                        })
                        pdfg.image('out2.png', pdfg.x, pdfg.y, {
                            width: 300
                        })
                        pdfg.end()

                        writeStreamG.on('finish', function () {
                            res.status(200).download('./' + idOrden + '.pdf');
                        });
                        console.log('done...!');

                    }
                });

            });

        }).catch(err => {
            res.status(500).json({
                error: err || "error"
            });
        });


    //doc.pipe(res.status(201));
});


const staticmap = require("staticmap");

router.get('/maps', function (req, res, next) {


    /*staticmap.getMap(staticmap.png({
            width: 500,
            height: 500
        }), 45.4724, -73.4520, 12)
        .then((image) => {
            image.save('out1.png');
        })
        .catch((err) => {
            console.log(err);
        });

    staticmap.getBox(staticmap.png({
            width: 500,
            height: 500
        }), 48.436034, 10.684891, 48.295985, 11.042633)
        .then((image) => {
            image.save('out2.png');
        })
        .catch((err) => {
            console.log(err);
        });*/

    staticmap.getMap(staticmap.png({
            width: 700,
            height: 700,
        }), -19.56604, -65.76899, 17)
        .then((image) => {
            //drawLine(x1, y1, x2, y2, color)
            image.drawLine(340, 340, 360, 340, "#ffffff");
            image.drawLine(340, 360, 360, 360, "#ffffff");
            image.drawLine(340, 340, 340, 360, "#ffffff");
            image.drawLine(360, 340, 360, 360, "#ffffff");
            image.drawLine(340, 340, 360, 360, "#ffffff");
            image.drawLine(360, 340, 340, 360, "#ffffff");
            image.drawLine(0, 30, 350, 360, "#ffffff");

            image.save('out2.png');
        })
        .catch((err) => {
            console.log(err);
        });
});
module.exports = router;

/*{
    "lugarEnvio": [
        1.2545121,
        1.2664656
    ],
    "menus": [
        {
            "fechaRegistro": "2018-11-22T19:50:04.654Z",
            "_id": "5bf70888eb5b111c9410649d",
            "precio": 5,
            "nombre": "hamburguesa",
            "__v": 0,
            "descripcion": "pan con carne y/o huevo y papas ",
            "restaurant": "5bf705dc9825331b589ab82a"
        },
        {
            "fechaRegistro": "2018-11-22T19:58:55.129Z",
            "_id": "5bf70aaa1252bc1d76e00d53",
            "nombre": "salchipapa",
            "descripcion": "salchichas y papas ",
            "restaurant": "5bf705dc9825331b589ab82a",
            "precio": 7,
            "__v": 0
        }
    ],
    "cantidad": [
        10,
        10
    ],
    "fechaRegistro": "2018-11-26T19:37:56.713Z",
    "_id": "5bfc4b97eed0e01af885f9c6",
    "cliente": {
        "fechaRegistro": "2018-11-22T20:03:07.024Z",
        "_id": "5bf70c66a2b3d21dab526277",
        "nombre": "Gilda Choque",
        "email": "gilda@gmail.com",
        "telefono": 72457891,
        "ci": "75941253",
        "__v": 0
    },
    "restaurant": {
        "fechaRegistro": "2018-11-22T19:37:05.507Z",
        "_id": "5bf705dc9825331b589ab82a",
        "nombre": "La cazona",
        "nit": "12456245",
        "propietario": "5bf705719825331b589ab829",
        "calle": "Bolivar # 100",
        "log": 1.454851545,
        "lat": 1.2545166,
        "__v": 0,
        "telefono": 6245785
    },
    "pagoTotal": 120,
    "__v": 0
} */