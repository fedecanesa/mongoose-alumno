const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema(
    {
        nombre: String,
        apellido: String,
        edad: Number,
        is_alumno: Boolean,
        curso: Number,
        comision:String
    });

const AlumnoModel = mongoose.model('Alumno', alumnoSchema);

module.exports = AlumnoModel;