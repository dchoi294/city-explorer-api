'use strict';
const axios = require('axios');
const cache = require('./cache');
require('dotenv').config();

async function getWeathers(required, response, next) {
  try {
    let searchLat = required.query.searchedLat;
    let searchLon = required.query.searchedLon;
    let key = `${searchLat}${searchLon}`;
    let dateNow = Date.now();

    if (cache[key] && (dateNow-key.timestamp< 50000)) {
      console.log('This is already in cache!');
      response.status(200).sned(cache[key].data);
    } else {
      let weatherCity = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${searchLat}&lon=${searchLon}&key=${process.env.WEATHER_API_KEY}&units=I&days=3`);

      let weathers = weatherCity.data.data.map(weather => new Forecast(weather));

      console.log('This is not in cache yet!');
      cache[key] = {
        data: weathers,
        timeStamp: Date.now()
      };

      response.status(200).send(weathers);
    }
  } catch (error) {
    // create a new instance of the Error object that lives in Express
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  }
}

class Forecast {
  constructor(cityObjectday) {
    this.date = cityObjectday.datetime;
    this.description = cityObjectday.weather.description;
  }
}

module.exports = getWeathers;
