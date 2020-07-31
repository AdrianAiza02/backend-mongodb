'use strict'

var UsuarioModel = require('../models/usuario.model');
var validator = require('validator');
var bcrypt = require('bcrypt');
var UserController = {
    probando: (req,res) => {
        return res.status(200).send({
            message: "Soy el metodo probando"
        });
    },


    testeando : (req,res)=> {
        return res.status(200).send({
            message: "Soy el metodo probando"
        });
    },

    getUsuarios: (req,res,next) => {
        UsuarioModel.find({estadoUsuario: 1},'nombre password correo img role estadoUsuario')
        .exec( 
            (err,usuarios)=> {
            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al recuperar usuarios BD',
                    errors: err
                });
            }
            res.status(200).send({
                ok: true,
                usuarios : usuarios
            });
        });
    },
    
    insertUsuario : (req,res,next) => {
        //recogemos los parametros de la peticion
        //var params = req.body;
        var paramsBody = req.body;
        //validar los datos
        var validate_nombre = !validator.isEmpty(paramsBody.nombre);
        var validate_correo = !validator.isEmpty(paramsBody.correo) && validator.isEmail(paramsBody.correo);
        var validate_password = !validator.isEmpty(paramsBody.password);;
        //console.log("nombre",validate_nombre );
       if (validate_nombre && validate_correo  && validate_password) {
            var usuario = new UsuarioModel({
                nombre: paramsBody.nombre,
                correo: paramsBody.correo.toLowerCase(),
                password: paramsBody.password,
                img: paramsBody.img,
                role: paramsBody.role,
                estadoUsuario: paramsBody.estadoUsuario
            });
            UsuarioModel.findOne({correo: usuario.correo}, (err,issetUser) => {
                if (err) {
                    return res.status(500).send({
                        ok: false,
                        message: "error al comprobar duplicidad"
                    });
                }
                if (!issetUser) {
                        const hashBD =  bcrypt.hashSync(usuario.password,10);
                        usuario.password = hashBD;
                        usuario.save( (err, usuarioGuardado) => {
                            if (err) {
                                return res.status(400).send({
                                    ok: false,
                                    message: "error al crear usuario BD",
                                    errors: err
                                });
                            }
                            return res.status(200).send({
                                ok: true,
                                usuario : usuarioGuardado,
                                usuarioToken: req.usuario
                            });
                        });         
                }
                else{
                    return res.status(500).send({
                        ok: false,
                        message: "El usuario ya esta registrado en la BD"
                    });
                }
            });     
        }
        else{
            return res.status(200).send({
                ok: false,
                message: "Introduzca datos correctos"
            });
        }
    },
    updateUsuario : (req,res,next) => {
        var id = req.params.id;
        var body = req.body;
        UsuarioModel.findById(id,(err,usuario) => {
            
            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al recuperar usuario by id BD',
                    errors: err
                });
            }
            if (!usuario) {
                return res.status(400).send({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: { mensaje : 'No existe un usuario con ese ID'}
                });
            }

            //validar nuevos campos
            var validate_nombre = !validator.isEmpty(body.nombre);
            var validate_correo = !validator.isEmpty(body.correo) && validator.isEmail(body.correo);;
            //var validate_password = !validator.isEmpty(body.password);
            var validate_role = !validator.isEmpty(body.role);
            if (validate_nombre && validate_correo && validate_role) {
                usuario.nombre = body.nombre;
                usuario.correo = body.correo;
                usuario.role = body.role;
                usuario.save( (err,usuarioGuardado) => {
                    if (err) {
                        return res.status(400).send({
                            ok: false,
                            mensaje: 'Error al actualizar usuario',
                            errors: err
                        });
                    }

                     usuarioGuardado.password = undefined;
                     res.status(200).send({
                        ok: true,
                        usuario: usuarioGuardado
                      
                    });
                });
            } else {
                return res.status(200).send({
                    ok: false,
                    message: "Introduzca datos correctos"
                });
            }

           
        });

    },
    deleteUserBD: (req,res,next) => {
        var id = req.params.id;

        UsuarioModel.findByIdAndRemove(id, (err, usuarioBorrado) => {
            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al eliminar usuario BD',
                    errors: err
                });
            }
            if (!usuarioBorrado) {
                return res.status(400).send({
                    ok: false,
                    mensaje: 'No existe un usuario con ese id',
                    errors: {mensaje: 'No existe un usuario con ese id'}
                });
            }
            res.status(200).send({
                ok: true,
                usuarios : usuarioBorrado
            });
        });
    },
    deleteLogicoBD: (req,res,next) => {
        var id = req.params.id;
        UsuarioModel.findByIdAndUpdate(id,{estadoUsuario:0},(err,usuarioBorradoLogico) => {
            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al eliminar logico BD',
                    errors: err
                });
            }
            if (!usuarioBorradoLogico) {
                return res.status(400).send({
                    ok: false,
                    mensaje: 'No existe un usuario con ese id',
                    errors: {mensaje: 'No existe un usuario con ese id'}
                });
            }
            usuarioBorradoLogico.estadoUsuario = 0;
            res.status(200).send({
                ok: true,
                usuarios : usuarioBorradoLogico
            });
        })
    }
};
module.exports = UserController;