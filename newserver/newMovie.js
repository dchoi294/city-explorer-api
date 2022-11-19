'use strict';
const axios = require('axios');
let cache = require('./cache.js');

async function getMovies(cityName) {
  const key = 'movie-' + cityName;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${cityName}&page=1&include_adult=false`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit Movie');
  } else {
    console.log('Cache miss Movie');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(url)
      .then(response => parseMovies(response.data));
  }

  return cache[key].data;
}

function parseMovies(movieData) {
  try {
    const movieSummaries = movieData.results.map(day => {
      return new Movie(day);
    });
    return Promise.resolve(movieSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.year = movieObject.released_date;
    // this.image_url= movieObject.poster_path;
  }
}

module.exports = getMovies;
