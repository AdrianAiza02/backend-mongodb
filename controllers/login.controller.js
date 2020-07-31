var UsuarioModel = require('../models/usuario.model');
var validator = require('validator');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/configjwt').SEED;

var LoginController = {
    login : (req,res) => {

        var body = req.body;

        //validar datos
        var validate_correo = !validator.isEmpty(body.correo) && validator.isEmail(body.correo);
        var validate_password = !validator.isEmpty(body.password);
        if (validate_correo && validate_password) {
            UsuarioModel.findOne({correo: body.correo.toLowerCase(), estadoUsuario: 1},(err, usuarioDB) => {
                if (err) {
                    return res.status(500).send({
                        ok: false,
                        mensaje: 'Error al buscar usuario',
                        errors: err
                    });
                }
                if (!usuarioDB) {
                    return res.status(200).send({
                        ok: false,
                        mensaje: 'credenciales incorrectas - correo',
                        errors : err
                    });
                }
                if (!bcrypt.compareSync(body.password,usuarioDB.password)) {
                    return res.status(200).send({
                        ok: false,
                        mensaje: 'credenciales incorrectas - password',
                        errors : err
                    });
                }
                //crear token!!!
                usuarioDB.password= undefined;
                var token = jwt.sign({usuario: usuarioDB}, SEED,{
                    expiresIn: 5400
                });
                res.status(200).send({
                    ok: true,
                    mensaje: 'Login post correcto',
                    usuario : usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            });
        }
        
      
    }
};

module.exports = LoginController;