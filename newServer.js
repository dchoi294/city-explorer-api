'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./newserver/newWeather.js');
const getMovies= require('./newserver/newMovie.js');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

app.get('/weather', weatherHandler);
app.get('/movie', movieHandler);

function weatherHandler(request, response) {
  const {searchedLat,searchedLon} = request.query;
  // const lat = request.query.queriedLat;
  // const lon = request.query.queriedLon;
  weather(searchedLat,searchedLon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`Server up on ${process.env.PORT}`));

function movieHandler(request, response) {
  //console.log(request.query);
  const {searchedCity} = request.query;
  //console.log(cityName);
  getMovies(searchedCity)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}
