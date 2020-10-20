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

var doc = {
    "lugarEnvio": [
        -19.579398,
        -65.763501
    ],
    "menus": [
        {
            "fechaRegistro": "2018-11-22T19:50:04.654Z",
            "_id": "5bf70888eb5b111c9410649d",
            "precio": 5,
            "nombre": "Hamburguesa",
            "__v": 0,
            "descripcion": "pan con carne y/o huevo y papas ",
            "restaurant": "5bf705dc9825331b589ab82a"
        },
        {
            "fechaRegistro": "2018-11-22T19:58:55.129Z",
            "_id": "5bf70aaa1252bc1d76e00d53",
            "nombre": "Salchipapa",
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
        "nombre": "Miguel Angel Mamani",
        "email": "mangelmcho@gmail.com",
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
}


const PDFDocument = require('pdfkit');
const fs = require('fs');
const StaticMaps = require("staticmaps");


var nodemailer = require('nodemailer'); // email sender function

router.get('/factura/:id', function (req, res, next) {


    /*Orden.findById(req.params.id).populate('restaurant').populate('menus').populate('cliente').exec()
        .then(doc => {*/

            // Create a document 

            pdf = new PDFDocument

            let idOrden = req.params.id;
            let writeStream = fs.createWriteStream('./temp/factura-' + idOrden + '.pdf');
            pdf.pipe(writeStream);
            // Add another page 

            pdf
                .fontSize(20)
                .text('Id de Factura : ' + idOrden, 100, 100)
                .moveDown()

            pdf.font('Courier',12).text('Nombre o Razon Social ' + doc.cliente.nombre, {
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

            pdf.text('Detalle \n Precio \n Cantidad', {
                width: 412,
                height: 15,
                columns: 3,
                align: 'left'
            })
            pdf.moveTo(90, pdf.y)
        		.lineWidth(2)
                .lineTo(510, pdf.y).stroke()

            pdf.moveDown()
            //console.log(pdf.x, pdf.y);
            pdf.rect(pdf.x - 5, pdf.y-5, 410, doc.menus.length * 22).stroke()

            for (let index = 0; index < doc.menus.length; index++) {
                //pdf.rect(pdf.x, pdf.y, 410, 15).stroke()
                pdf.text(doc.menus[index].nombre + '\n' + doc.menus[index].precio + '\n' + doc.cantidad[index], {
                    width: 312,
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
            /*pdf.text('Fecha de venta : ' + doc.fechaRegistro.toString(), {
                width: 412,
                align: 'center'
            })
            pdf.moveDown()*/
            // Finalize PDF file 
            pdf.end()

            //ENVIAR FACTURA AL CORREO DEL CLIENTE.

            /*
                Ejemplo con gmail
                se debe  activar la opcion "Acceso de aplicaciones poco seguras"
                link https://myaccount.google.com/lesssecureapps
            */ 
            /*
            let config = JSON.parse(fs.readFileSync("config.json"));
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                    user: 'maangelmcho@gmail.com', //el correo ,del que se enviara el email
                    pass: '3n0Clan2.0' //aqui va la contraseña de su correo
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            */
            /*
                Ejemplo con ethereal.email
                es directo y gratis (fake smtp server) no hace envio reales
                te da un usuari y pass aleatorio 
                link https://ethereal.email/
            */             
            
            const transporter = nodemailer.createTransport({
				host: 'smtp.ethereal.email',
				port: 587,
				secure: false, 
				auth: {
					user: 'lisandro.west89@ethereal.email',
					pass: 'vsVHbDfVgFvgrJwZ41'
				}
            });
            
            /*
                Ejemplo con mailtrap.io 
                hay que registrase , es gratis (fake smtp server) no hace envio reales
                link https://mailtrap.io/i
            */ 
            /*
			var transporter = nodemailer.createTransport({
				host: "smtp.mailtrap.io",
				port: 2525,
				auth: {
				  user: "416574434ba649",
				  pass: "11cbde3da6554b"
				}
			  });
            */
            var mailOptions = {
                from: 'Api Rest Store!',
                to: doc.cliente.email,// Aqui va la dir de email a quien se enviara
                subject: 'Factura por servicio',
                text: 'Adjuntamos la factura por servicio de comidas, gracias por tu preferencia '+ doc.cliente.nombre || "",
                attachments: [{
                    path: "./temp/factura-" + idOrden + ".pdf"
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
                        let idOrden = req.params.id;
                        const options = {
                            width: 600,
                            height: 800
                        };
                        const map = new StaticMaps(options);
                        const marker = {
                            img: `./public/images/map-marker-icon.png`, // can also be a URL
                            offsetX: 24,
                            offsetY: 48,
                            width: 48,
                            height: 48,
                            coord : [doc.lugarEnvio[1],doc.lugarEnvio[0]]
                        };
                        map.addMarker(marker);
                        map.render()
                            .then(() => map.image.save('./temp/map-' + idOrden + '.png'))
                            .then(() => {
                                console.log('imagen creada de manera exitosa!'); 
                                pdfg = new PDFDocument;
                                let writeStreamG = fs.createWriteStream('./temp/guia-' + idOrden + '.pdf');
                                pdfg.pipe(writeStreamG);
                            
                                pdfg.fontSize(20)
                                    .text('Orden de Entrega: ' + idOrden, 100, 100)
                                    .moveDown()

                                pdfg.fontSize(12).text('Nombre del cliente ' + doc.cliente.nombre, {
                                        width: 412,
                                        align: 'left'
                                    })
                                    .moveDown()
                                pdfg.image('./temp/map-' + idOrden + '.png', pdfg.x, pdfg.y, {
                                        width: 450,
                                        height: 600
                                    })
                                pdfg.end()

                                writeStreamG.on('finish', function () {
                                    res.status(200).download('./temp/guia-' + idOrden + '.pdf');
                                });


                                console.log('dpf guia hecho!');
                                /*res.json({
                                    message: "Email enviado de manera exitosa!",
                                    info: info
                                });*/
                                
                             
                            })        
                            .catch(error => {
                                res.json({
                                    error: error
                                });
                                console.log(error);
                            }); 
                        
                        

                    }
                });

            });
/*
        }).catch(err => {
            res.status(500).json({
                error: err || "error"
            });
        });*/


    //doc.pipe(res.status(201));
});



router.get('/maps/:id', function (req, res, next) {
    let idOrden = req.params.id;
    const options = {
        width: 600,
        height: 800
      };
      const map = new StaticMaps(options);
      const marker = {
        img: `./public/images/map-marker-icon.png`, // can also be a URL
        offsetX: 24,
        offsetY: 48,
        width: 48,
        height: 48,
        coord : [doc.lugarEnvio[1],doc.lugarEnvio[0]]
      };
      map.addMarker(marker);
      map.render()
        .then(() => map.image.save('./temp/map-' + idOrden + '.png'))
        .then(() => { 
            console.log('File saved!');
            res.json({
                message: "imsgen creada de manera exitosa!"
            });
         })        
        .catch(error => {
            res.json({
                error: error
            });
            console.log(error);
        });
            
    
    /*staticmap.getMap(staticmap.png({
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
        });*/
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