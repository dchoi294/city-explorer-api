const axios = require('axios');

let cache = {};

async function getMovies(required, response, next) {
  try {
    let city = required.query.searchedCity;
    let key = `${city}`;
    let dateNow = Date.now();

    if (cache[key] && (dateNow - key.timestamp < 50000)) {
      console.log('This is already in cache!');
      response.status(200).sned(cache[key].data);
    } else {
      let movieCity = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`);

      let moviesArray = movieCity.data.results.map(movie => new Movie(movie));

      cache[key] = {
        data: moviesArray,
        timeStamp: Date.now()
      };

      response.status(200).send(moviesArray);
    }
  } catch (error) {
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  }
}

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.year = movieObject.release_date.slice(0, 4);
  }
}

module.exports = getMovies;
