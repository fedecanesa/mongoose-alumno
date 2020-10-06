/*
1- Crear base de datos en MongoDB Atlas llamada "alumnos-abm" con una collection llamada "alumnos" 
2- Crear proyecto e instalar mongoose y express.
3- Crear el modelo de Alumno (./models/Alumno.js)
4- Crear endpoints express (Implementar bodyParser) GetAlumnoById | CreateAlumno | DeleteAlumnoById en un archivo llamado index.js
5- Conectar la aplicacion a MongoDB Atlas.
6- Utilizar el modelo de Alumno para Consultar / Crear / Eliminar segun corresponda en el metodo http correcto
*/

//URL POSTMAN: https://www.getpostman.com/collections/898316461ebfa62b7e5e


const CONNECTION_STRING = 'mongodb+srv://federico:federico@cluster0.rsido.mongodb.net/alumnos-abm?retryWrites=true&w=majority';
const PORT = '4200';
const mongoose = require('mongoose');
const morgan = require(`morgan`);
const Alumno = require(`./models/Alumno`);


//Importar express
const express = require(`express`);

//Instanciar app express
const app = express();

//Midleware
app.use(morgan(`dev`));

//BodyParser
app.use(express.json());

//Ruta inicial
app.get( '/', function ( req , res )
{
    res.status(200).send({message:"Server Express Up & Running"});
});

//GetAlumnoById
app.get(`/alumno/:id` , function(req , res) 
{
    let ID = req.params.id;

    Alumno.findById(ID).then(function(AlumnoEncontrado)
    {
        if(!AlumnoEncontrado) return res.status(404).send({error});

        res.status(200).send({AlumnoEncontrado});

    }).catch(function(err)
    {
        res.status(500).send({err});
    });
});

//CreateAlumno
app.post(`/alumno` , function ( req , res )
{
    let alumno = new Alumno (
        {
            "nombre": req.body.nombre,
            "apellido": req.body.apellido,
            "edad": req.body.edad,
            "is_alumno": true,
            "curso": req.body.curso,
            "comision": req.body.comision
        }
    );
    
    alumno.save().then(function(alumnoGuardado)
    {
        res.status(201).send({alumnoGuardado})
    }).catch(function(err)
    {
        res.status(404).send({err});
    });
   
});

//DeleteAlumnoById
app.delete(`/alumno/:id` , function(req , res)
{
    let ID = req.params.id;

    Alumno.findByIdAndUpdate( ID , { is_alumno:false } , {new:true} ).then( function(alumnoActualizado)
    {
        res.status(200).send({alumnoActualizado});
    }).catch(function(err)
    {
        res.status(500).send({err});
    })
});


//Levantar la applicacion luego de realizar la conexion de mongoose a Atlas.
mongoose.connect( CONNECTION_STRING , function ( err )
{
    if ( err )
    {
        console.error( err.message )
    }
    else
    {
        console.log("Conexion establecida");
        app.listen( PORT , function()
        {
            console.log("Server Express Listening");
        });
    }
})