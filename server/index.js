const Registro = require('./models/registro')
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const redis = require('redis');
const client = redis.createClient({
  url: 'redis://:grupo14so1@35.230.106.175:6379'
});

const app = express()
app.use(cors())

const servidor = http.createServer(app);


const io = require('socket.io')(servidor);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://35.230.106.175:27017";

io.on('connection', function(socket){
  socket.on('send-message', function(data){
    socket.emit('text-event', "hola mundio")
    socket.broadcast.emit('text-event', "hola mundio")
  })
  /*interval = setInterval( () => {
    getVacunados();
    socket.emit("data", "funciono")
  }, 2000);*/
});


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
      "retorno" : retorno,
      "retorno1" : retorno1,
      "retorno2" : retorno2,
      "retorno3" : retorno3,
      "retorno4" : retorno4,
      "retorno5" : retorno5,
    }
    io.emit('message', envio);
    console.log("se envio")
    await client.quit();
    return envio
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

app.listen(5050, () => console.log('Server levantado en el puerto 5050') )


