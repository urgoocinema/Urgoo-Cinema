const template = document.createElement("template");
template.innerHTML = `
  <style>
    .container {
      margin: clamp(4rem, 6vw, 5rem) 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: clamp(3rem, 4vw, 5rem) 5rem;
      justify-content: center;
    }
  </style>
`;

export class MovieList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.container.classList.add("container");
    

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {}

  attributeChangedCallback(attr, oldVal, newVal) {
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const res = await fetch("./data/movies-list.json");
    const data = await res.json();

    for (let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      const movieCard = document.createElement("movie-card");
      movieCard.setAttribute("id", movie.id);
      movieCard.setAttribute("title", movie.title);
      movieCard.setAttribute("description", movie.description);
      movieCard.setAttribute("duration", movie.duration);
      movieCard.setAttribute("poster_url", movie.poster_url);
      movieCard.setAttribute("age_rating", movie.age_rating);
      movieCard.setAttribute("cc", movie.cc);
      movieCard.setAttribute("imdb_rating", movie.imdb_rating);

      movieCard.cast = movie.cast;
      movieCard.genres = movie.genres;
      movieCard.showtimes = movie.showtimes;

      this.container.appendChild(movieCard);
    }
  }

  onTimeSelected(e) {
    const { movieId, day, hour } = e.detail;

    // find (or create) your seat-selector:
    const seatSelector = document.querySelector('seat-selector');
    if (!seatSelector) return;

    // pass data via properties (preferred) or attributes:
    seatSelector.movieId = movieId;
    seatSelector.day     = day;
    seatSelector.hour    = hour;

    // if you rely on attributeChangedCallback:
    // seatSelector.setAttribute('movie-id', movieId);
    // seatSelector.setAttribute('day', day);
    // seatSelector.setAttribute('hour', hour);
  }

  disconnectedCallback() {}
}

customElements.define("movie-list", MovieList);
