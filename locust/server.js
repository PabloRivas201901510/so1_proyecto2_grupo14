const express = require('express');
const router = express.Router();

const app = express();

// Settings 
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(express.json());

// Routes
app.use('/', router);

router.post('/', async (req, res) => {
    const { name, location, age, vaccine_type, n_dose } = req.body;
    console.log({name:name, location:location, age:age, vaccine_type:vaccine_type, n_dose:n_dose});
    res.json({name:name, location:location, age:age, vaccine_type:vaccine_type, n_dose:n_dose});
});

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});