'use strict';

console.log(':D');

// Require
const express = require('express');
let data = require('./data/weather.json');

// we need to bring in our .env file, so we'll use this after we have installed
// `npm i dotenv`
require('dotenv').config();

// we must include CORS if we want to share resources over the web
const cors = require('cors');

// USE
// once we have required something, we have to use it
// Here is where we will assign the required file a variable
// React does this in one step with 'import' - express takes 2 steps: require and use
// This is just how express works
const app = express();

// We must tell express to use cors
app.use(cors());

// define the PORT and validate that our .env is working
const PORT = process.env.PORT || 3002;
// If we see our server running on 3002, that means theere's a problem with our .env file or how we are importing it.

// ROUTES
// this is where we will write handlers for our endpoints

// create a basic default route
// app.get() correlates to axios.get()
// app.get() takes in a parament or a URL in quotes, and callback function
app.get('/', (reqired, response) => {
  response.send('Hello, from our server');
});

app.get('/sayHello', (required, response)=> {
  console.log(required.query.name);
  let lastName = required.query.lastName;
  response.send(`Hi ${required.query.name} ${lastName}`);
});

app.get('/weather', (required, response, next) => {
  try {
    let city = required.query.cityName;

    let selectedCity = data.find(weather => weather.city_name === city);
    let cityCleanedUp = new Forecast(selectedCity);
    response.send(cityCleanedUp);

  } catch (error) {
    // create a new instance of the Error object that lives in Express
    next(error);
    throw(500);
  }
});

// '*' wild card
// this will run for any route not defined above
app.get('*', (required, response) => {
  response.send('That route does not exist');
});

// ERRORS
// handle any errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// CLASSES
class Forecast {
  constructor(cityObject, day) {
    this.date = cityObject.data[day].valid_date;
    this.description = cityObject.data[day].weather.description;
  }
}

// LISTEN
// start the server

// listen is express method, it takes in a port value and a callback function
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
