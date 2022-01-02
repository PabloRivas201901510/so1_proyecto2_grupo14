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

//---------------- CONEXION - REDIS
const client = redis.createClient({
  url: 'redis://:grupo14so1@34.82.25.144:6379'
});
/*client.on('connect', function(){
  console.log("conectado redis");
});*/

//---------- CONFIG SERVER
let app = express()
const servidor = http.createServer(app);
const io = require('socket.io')(servidor, {
  cors: { origin: '*' }
});
app = express_1.default();
const port = 8080;
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
app.use(morgan_1.default('dev')); // debuguer para ver errores
app.use(cors_1.default()); // para conectarse al cliente
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));


//------------- CONNEXION MONGODB
var MongoClient = require('mongodb').MongoClient;
var url_mongodb = "mongodb://www.so1g14.tk:27017";

var respuesta = ""; // ANSWER FOR EMIT
var respuesta1 = ""; // ANSWER FOR EMIT
var respuesta2 = ""; // ANSWER FOR EMIT
var respuesta3 = ""; // ANSWER FOR EMIT

//-------------- GET MONGODB DATA
async function getMongoDB(){

  //---------- porcentaje de vacunados, una dosis, por departamentos, etc., en MongoDB
  MongoClient.connect(url_mongodb, function(err, db) {
    if (err) throw err;
    var dbo = db.db("covid");
    dbo.collection("vacundata").aggregate(
      [ 
        {
          $group : {
            _id : '$location',
            count : {$sum : { $cond : [ { $eq : ['$n_dose', 1]}, 1, 0]}}
          }
        },
        { $sort : {count : -1}}
      ]
    ).toArray(function(err, result) {
      if (err) throw err;
      var s = JSON.stringify(result)
      respuesta1 = "{ \"mongodb1\" : "+s+"}"
      db.close();
    });
  });

  // Top 3 de áreas con mayor vacunados con esquema completo en MongoDB.
  //---------- porcentaje de vacunados, esquema completo, por departamentos, etc., en MongoDB
  MongoClient.connect(url_mongodb, function(err, db) {
    if (err) throw err;
    var dbo = db.db("covid");
    dbo.collection("vacundata").aggregate(
      [ 
        {
          $group : {
            _id : '$location',
            count : {$sum : { $cond : [ { $gt : ['$n_dose', 1]}, 1, 0]}}
          }
        },
        { $sort : {count : -1}}
      ]
    ).toArray(function(err, result) {
      if (err) throw err;
      //console.log("MONGO DB2 ----------", result);
      var s = JSON.stringify(result)
      respuesta2 = "{ \"mongodb2\" : "+s+"}"
      db.close();
    });
  });

  MongoClient.connect(url_mongodb, function(err, db) {
    if (err) throw err;
    var dbo = db.db("covid");
    dbo.collection("vacundata").find({}).toArray(function(err, result) {
      if (err) throw err;
      //console.log("MONGO DB2 ----------", result);
      var s = JSON.stringify(result)
      respuesta3 = "{ \"mongodb3\" : "+s+"}"
      db.close();
    });
  });

  
}


//------------- GET REDIS DATA
async function getVacunados() {
  try {
    await client.connect();
    
    let retorno = await client.lRange('list-vacun-data', '0', '4');
    let retorno1 = await client.lLen('ninos');
    let retorno2 = await client.lLen('adolescentes');
    let retorno3 = await client.lLen('jovenes');
    let retorno4 = await client.lLen('adultos');
    let retorno5 = await client.lLen('vejez');
    
    await client.quit();
    var envio = {
      "retorno" : retorno,
      "retorno1" : retorno1,
      "retorno2" : retorno2,
      "retorno3" : retorno3,
      "retorno4" : retorno4,
      "retorno5" : retorno5,
    }
    var s = JSON.stringify(envio)
    respuesta = s
    //await client.disconnect();
  } catch (err) {
    //console.error("ERROR", err);
  }
}




//----------- CONNEXION SOCKET.IO
io.on('connection', (socket) => {
  console.log("conectado")
  
  setInterval( () => {
    getVacunados();
    getMongoDB();
    //console.log("message", respuesta)
    
    socket.emit("message", respuesta + "|\n"+ respuesta1 +"|\n"+respuesta2+"|\n"+respuesta3 )
    
  }, 2000);
});



//------- LISTENING ON PORT
servidor.listen(port, () => console.log(`listening on port ${port}`) )


