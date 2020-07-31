'use strict'

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: 'El nombre es necesario'},
    correo: { type: String, unique: true, required: 'El correo es necesario'},
    password: { type: String, required: 'La contraseña es necesaria'},
    img: {type: String, require: false},
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},
    date: { type: Date, default: Date.now},
    estadoUsuario: {type: Number, default: 1}
});

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe de ser unico'});
module.exports = mongoose.model('Usuario',usuarioSchema);