const Registro = require('./models/registro')
const express = require('express');
const http = require('http');
const socketio =  require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const redis = require('redis');
const client = redis.createClient({
  url: 'redis://:grupo14so1@35.230.106.175:6379'
});

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

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (message) => {
      console.log(message);
      io.emit('message', message);
  });
  socket.on('disconnect', () => {
      console.log('a user disconnected!');
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

async function getVacunados(req, res, next) {
  try {
    await client.connect();
    let retorno = await client.lRange('list-vacun-data', '0', '4');
    res.send(retorno);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

app.get('/redis', getVacunados);

app.listen(8080, 'localhost', () => console.log('Server levantado en el puerto 8080'))
