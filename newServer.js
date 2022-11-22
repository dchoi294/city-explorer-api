'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./newserver/newWeather');
const getMovies= require('./newserver/newMovie');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

app.get('/weather', weatherHandler);
app.get('/getMovies', movieHandler);

function weatherHandler(request, response) {
  //const {lat,lon} = request.query;
  const lat = request.query.queriedLat;
  const lon = request.query.queriedLon;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`Server up on ${process.env.PORT}`));

function movieHandler(request, response) {
  //console.log(request.query);
  const {cityName} = request.query;
  //console.log(cityName);
  getMovies(cityName)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}
