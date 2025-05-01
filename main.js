// import { createMovieCard } from './utils/movie-card-component.js';
import showSlides, {plusSlides, currentSlide} from './utils/slideshow.js';
import './components/movieCard.js';
import './components/movieList.js';
import './components/countdownLive.js';

document.querySelector(".prev").addEventListener("click", () => {
    plusSlides(-1);
});
document.querySelector(".next").addEventListener("click", () => {
    plusSlides(1);
});


showSlides(1);

// const res = await fetch("./data/movies-list.json");
// const data = await res.json();
// const ongoingContainer = document.querySelector(".ongoing");

// Fetch movies and generate components
// async function loadMovies() {
//   try {
//     const movieData = await fetch('./data/movies-list.json');
//     const ongoingSection = document.querySelector('.ongoing .flex-container');

//     const data = await movieData.json();

//     data.movies.forEach(movie => {
//       const movieCard = createMovieCard(movie);
//       ongoingSection.appendChild(movieCard);
//     });
//   } catch (error) {
//     console.error('Error loading movies:', error);
//   }
// }

//loadMovies();

