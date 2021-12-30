const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Registro = mongoose.model('Registro', new Schema({
    name: String,
    location: String,
    age: Number,
    vaccine_type: String,
    n_dose: Number
}));

module.exports = Registro;