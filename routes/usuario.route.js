'use strict'

var express = require('express');
var app = express();
var UserController = require('../controllers/user.controller');
var mdAutentication = require('../middlewares/authenticated');



app.get('/', UserController.getUsuarios);
app.post('/insertando', mdAutentication.auth , UserController.insertUsuario);
//app.get('/probando', UserController.probando);
app.put('/:id',mdAutentication.auth ,UserController.updateUsuario);
app.put('/deleteLogico/:id',mdAutentication.auth ,UserController.deleteLogicoBD);
app.delete('/:id',mdAutentication.auth ,UserController.deleteUserBD);

module.exports = app;