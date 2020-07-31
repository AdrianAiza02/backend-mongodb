var express = require('express');
var app = express();

app.get('/', (req,res,next) => {
    res.status(200).send({
        ok: true,
        mensaje: 'Peticion realizada'
    });
});

module.exports = app;