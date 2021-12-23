// const Registro = require('./models/registro')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// const options = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose
  .connect('mongodb://172.17.0.2:27017/app')
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch((err) => {
    console.log('Error conectando a MongoDB:')
    console.log(err)
  })

app.listen(8001, 'so1g14.tk', () => console.log('Server levantado en el puerto 8001'))
