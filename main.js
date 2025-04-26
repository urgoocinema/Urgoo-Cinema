import { createMovieCard } from './utils/movie-card-component.js';
import showSlides from './utils/slideshow.js';
import './components/movieCard.js';
import './components/movieList.js';

showSlides(1);

// Fetch movies and generate components
async function loadMovies() {
  try {
    const movieData = await fetch('./data/movies-list.json');
    const ongoingSection = document.querySelector('.ongoing .flex-container');

    const data = await movieData.json();

    data.movies.forEach(movie => {
      const movieCard = createMovieCard(movie);
      ongoingSection.appendChild(movieCard);
    });
  } catch (error) {
    console.error('Error loading movies:', error);
  }
}

loadMovies();