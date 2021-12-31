"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};

const Registro = require('./models/registro')
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const redis = require('redis');
const express_1 = __importDefault(require("express"));

// REDIS
const client = redis.createClient({
  url: 'redis://:grupo14so1@34.82.25.144:6379'
});

client.on('connect', function () {
  console.log("conectado redis");
});

let app = express()

const servidor = http.createServer(app);

const io = require('socket.io')(servidor, {
  cors: { origin: '*' }
});

app = express_1.default();

const port = 8080;
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));

app.use(morgan_1.default('dev'));
app.use(cors_1.default()); // para conectarse al cliente

app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));

//var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://35.230.106.175:27017";


/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("covid");
  dbo.collection("vacundata").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    io.emit('message', result);
    db.close();
  });
});*/
<<<<<<< HEAD:server/index.js
var respuesta = "";
=======

async function start() {
  await client.connect()
}
>>>>>>> 2c718be8b82133760e31ef35895dcd8fde99fa38:vm/server/index.js

async function getVacunados() {
  try {
    await client.connect();
    let retorno = await client.lRange('list-vacun-data', '0', '4');
    let retorno1 = await client.lLen('ninos');
    let retorno2 = await client.lLen('adolescentes');
    let retorno3 = await client.lLen('jovenes');
    let retorno4 = await client.lLen('adultos');
    let retorno5 = await client.lLen('vejez');
    var envio = {
      "retorno": retorno,
      "retorno1": retorno1,
      "retorno2": retorno2,
      "retorno3": retorno3,
      "retorno4": retorno4,
      "retorno5": retorno5,
    }
    respuesta = "{\"retorno\":["+retorno+"],\"retorno1\":"+retorno1+",\"retorno2\":"+retorno2+",\"retorno3\":"+retorno3+",\"retorno4\":"+retorno4+",\"retorno5\":"+retorno5+"}"
    await client.quit();
<<<<<<< HEAD:server/index.js
    //await client.disconnect();
=======
    await client.disconnect();

>>>>>>> 2c718be8b82133760e31ef35895dcd8fde99fa38:vm/server/index.js
  } catch (err) {
    console.error("ERROR", err);
  }
}

io.on('connection', (socket) => {
  console.log("conectado")
<<<<<<< HEAD:server/index.js
  
  setInterval( () => {
=======

  setInterval(() => {
    console.log("message")
>>>>>>> 2c718be8b82133760e31ef35895dcd8fde99fa38:vm/server/index.js
    getVacunados()
    console.log("message", respuesta)
    
    socket.emit("message", respuesta)
  }, 5000);
});




servidor.listen(port, () => console.log(`listening on port ${port}`))

