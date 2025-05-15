// import { createMovieCard } from './utils/movie-card-component.js';
import showSlides, {plusSlides, currentSlide} from './utils/slideshow.js';
import './components/movieCard.js';
import './components/movieList.js';
import './components/countdownLive.js';
import './components/seatSelector.js';
import './components/Header.js';
import './components/Footer.js';

document.querySelector(".prev").addEventListener("click", () => {
    plusSlides(-1);
});
document.querySelector(".next").addEventListener("click", () => {
    plusSlides(1);
});

showSlides(1);

window.addEventListener('beforeunload', ()=>{sessionStorage.setItem('scrollY', window.scrollY)});
window.addEventListener('load', ()=> {
    const scrollY = sessionStorage.getItem('scrollY');
    const waitForContent = () => {
        const contentReady = document.querySelector('movie-list');
        if(contentReady && contentReady.offsetHeight > 500){
            window.scrollTo(0, parseInt(scrollY));
            sessionStorage.removeItem('scrollY');
        } else {
            setTimeout(waitForContent, 50);
        }
    };
    waitForContent();
});