const Registro = require('./models/registro')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())





mongoose
  .connect('mongodb://localhost:27017')
  .then((res) => {
    console.log('Conectado a MongoDB')
  })
  .catch((err) => {
    console.log('Error conectando a MongoDB:')
    console.log(err)
  })

Registro.find(
  {
    name: "Felipe2",
    location: "Mixco",
    age: 22,
    vaccine_type: "Sputnik",
    n_dose: 2
  }
)
.then(doc => {
  console.log(doc)
})
.catch(err => {
  console.error(err)
})



app.listen(8001, 'localhost', () => console.log('Server levantado en el puerto 8001'))
