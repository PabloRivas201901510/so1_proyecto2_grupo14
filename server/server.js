const Registro = require("./models/registro")
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const socketio =  require('socket.io');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const servidor = http.createServer(app);
const io = socketio(servidor, {
    cors: {
        origin: "*"
    },
});


mongoose.connect('****MONGODB CONEXION****', { useNewUrlParser: true, useUnifiedTopology: true });

io.on('CONEXION SUCCESSIBLE', socket => {
    console.log("CONEXION SUCCESSIBLE");

    interval = setInterval(() => {
        Registro.find().exec().then(
            env => socket.emit("Registro", env));
    }, 500);

    socket.on('DISCONNECT', () => { 
        console.log("DISCONNECTED");
    });
});

servidor.listen(4000, () => console.log('Server levantado en el puerto 4000'));