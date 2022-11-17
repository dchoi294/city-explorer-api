const axios = require('axios');

async function getWeathers(required, response, next) {
  try {
    let searchLat = required.query.searchedLat;
    let searchLon = required.query.searchedLon;
    let weatherCity = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${searchLat}&lon=${searchLon}&key=${process.env.WEATHER_API_KEY}&units=I&days=3`);

    let weathers = weatherCity.data.data.map(weather => new Forecast(weather));

    response.send(weathers);

  } catch (error) {
    // create a new instance of the Error object that lives in Express
    next(error);
    throw (500);
  }
}

class Forecast {
  constructor(cityObjectday) {
    this.date = cityObjectday.datetime;
    this.description = cityObjectday.weather.description;
  }
}

module.exports = getWeathers;
