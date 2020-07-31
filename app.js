//requires

var express = require('express');
var bodyParser = require('body-parser');
//mongoose.Promise = global.Promise;
//iniciar variables;

var app = express();





var mongooseConexion = require('mongoose');

//conexion bd

mongooseConexion.connect('mongodb+srv://almejandra:almejandra@clusterdb.tpfhj.gcp.mongodb.net/HospitalDB?retryWrites=true&w=majority',
                {useNewUrlParser: true, useUnifiedTopology:true,useCreateIndex:true})
                .then(() => {
                                       console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
                })
                .catch(error => console.log(error));
               /*mongoose.connect('mongodb+srv://almejandra:almejandra@clusterdb.tpfhj.gcp.mongodb.net/ClusterDB?retryWrites=true&w=majority',
               {useNewUrlParser: true, useUnifiedTopology:true},(err,res) => {
                   if(err) throw err;
                   console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
               });
               */



//bodyparser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//importar rutas
var appRoutes = require('./routes/app.route');
var appUsuarios = require('./routes/usuario.route');
var appLogin = require('./routes/login.route');
//rutas
app.use('/', appRoutes);
app.use('/usuario', appUsuarios);
app.use('/login',appLogin);

//escuchar peticiones
app.listen(3000 , () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});