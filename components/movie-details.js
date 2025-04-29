class MovieDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._movieId = null;
    }
    static get observedAttributes() {
        return ["movie-id"];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "movie-id" && oldValue !== newValue) {
            this._movieId = newValue;
            this.render();
        }
    }

    async render() {
        const movieId = this.getAttribute("movie-id") || this._movieId;

        if (!movieId) {
            this.shadowRoot.innerHTML = `<p>Please provide a movie ID.</p>`;
            return;
        }

        this.shadowRoot.innerHTML = `<p>Loading...</p>`;

        try {
            const response = await fetch("../data/movies-list.json");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const allMoviesData = await response.json();

            const movieData = allMoviesData.movies.find(
                (movie) => movie.id.toString() === movieId
            );
            if (!movieData) {
                this.shadowRoot.innerHTML = `<p>Movie with ID ${movieId} not found. </p>`;
                return;
            }
            const posterSrc = movieData.poster_url || "";
            const movieTitle = movieData.title || "Movie-title";
            const ratingText = movieData.age_rating || "";
            const description = movieData.description || "No description available.";
            const cast = movieData.cast ? movieData.cast.join(", ") : "N/A"; // Join cast array
            const duration = movieData.duration || "N/A"; // Assuming JSON has duration
            const language =
                movieData.cc === "mongolian"
                    ? "Монгол хэл"
                    : movieData.cc
                        ? "Англи хэл"
                        : "N/A"; // Assuming JSON has cc field

            this.shadowRoot.innerHTML = `
                <img
          src="${posterSrc}"
          alt="${movieTitle} poster"
        />
        <div class="first-div">
          <h1>${movieTitle}<span class="rating age-pg">${ratingText}</span></h1>
          <p>
    ${description}
          </p>
          <p>
            ${description}
          </p>
          <div class="info-details first-div">
            <p class="cast">
              <span class="gray">Гол дүр:</span>

              <span class="white">
    ${cast}
              </span>
            </p>
            <p class="duration">
              <span class="gray">Үргэлжлэх хугацаа: </span>
              <span class="white">${duration}</span>
            </p>
            <p class="lang">
              <svg
                class="cc-icon gray"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="white"
              >
                <path
                  d="M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-480H200v480Zm80-120h120q17 0 28.5-11.5T440-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T400-600H280q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h120q17 0 28.5-11.5T720-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T680-600H560q-17 0-28.5 11.5T520-560v160q0 17 11.5 28.5T560-360ZM200-240v-480 480Z"
                />
              </svg>
              <span class="gray">Хэл:</span>
              <span class="white">${language}</span>
            </p>
          </div>
            `;
        } catch (error) {
            console.error("Error fetching movie data:", error);
            this.shadowRoot.innerHTML = `<p>Error fetching movie data. Please try again later. ${error.message}</p> `;
        }
    }
}
customElements.define("movie-details", MovieDetails);
