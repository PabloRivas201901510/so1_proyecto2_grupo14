const Registro = require('./models/registro')
const express = require('express');
const http = require('http');
const socketio =  require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express()
app.use(cors())
app.use(express.json())

const servidor = http.createServer(app);
const io = socketio(servidor, {
    cors: {
        origin: "*"
    },
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://35.230.106.175:27017";



io.on('connection', socket => {
  console.log("Conectado");

  interval = setInterval(() => {
      Comentario.find().exec().then(
          x => socket.emit("Comentarios", x));
  }, 500);

  socket.on('disconnect', () => { 
      console.log("Desconectado");
  });
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("covid");
  dbo.collection("vacundata").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    io.emit('message', result);
    db.close();
  });
});




app.listen(8080, 'localhost', () => console.log('Server levantado en el puerto 8080'))
