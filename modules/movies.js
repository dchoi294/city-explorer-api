const axios = require('axios');

async function getMovies(required, response, next) {
  try {
    let city = required.query.searchedCity;
    let movieCity = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`);

    let moviesArray = movieCity.data.results.map(movie => new Movie(movie));

    response.send(moviesArray);
  } catch (error) {
    next(error);
  }
}

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.year = movieObject.release_date.slice(0,4);
  }
}

module.exports = getMovies;
