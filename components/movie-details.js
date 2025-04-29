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
            this.shadowRoot.innerHTML = `<style>${this.getStyles()}</style><p>Please provide a movie ID.</p>`;
            return;
        }

        this.shadowRoot.innerHTML = `<style>${this.getStyles()}</style><p>Loading...</p>`;

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
                this.shadowRoot.innerHTML = `<style>${this.getStyles()}</style><p>Movie with ID ${movieId} not found. </p>`;
                return;
            }
            const posterSrc = movieData.poster_url || "";
            const movieTitle = movieData.title || "Movie-title";
            const ratingText = movieData.age_rating || "";
            const description = movieData.description || "No description available.";
            const cast = movieData.cast ? movieData.cast.join(", ") : "N/A"; // Join cast array
            const duration = movieData.duration || "N/A"; // Assuming JSON has duration
            const language = movieData.cc === "mongolian" ? "Монгол хэл" : movieData.cc ? "Англи хэл" : "N/A"; // Assuming JSON has cc field

            this.shadowRoot.innerHTML = `
                <style>
                    ${this.getStyles()}
                </style>
                <img class="poster" src="${posterSrc}" alt="${movieTitle} poster" />
                <div class="details-content">
                    <h1>${movieTitle}<span class="rating">${ratingText}</span></h1>
                    <p>${description.replace(/\n/g, "<br>")}</p>

                    <div class="info-details">
                        <p class="cast">
                            <span class="gray">Гол дүр:</span>
                            <span class="white">${cast}</span>
                        </p>
                        <p class="duration">
                            <span class="gray">Үргэлжлэх хугацаа:</span>
                            <span class="white">${duration}</span>
                        </p>
                        <p class="lang">
                            <svg class="cc-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path d="M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-480H200v480Zm80-120h120q17 0 28.5-11.5T440-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T400-600H280q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h120q17 0 28.5-11.5T720-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T680-600H560q-17 0-28.5 11.5T520-560v160q0 17 11.5 28.5T560-360ZM200-240v-480 480Z"/>
                            </svg>
                            <span class="gray">Хэл:</span>
                            <span class="white">${language}</span>
                        </p>
                        <!-- Add genres and imdb rating if needed -->
                        ${movieData.genres ? `<p class="genres"><span class="gray">Төрөл:</span> <span class="white">${movieData.genres.join(", ")}</span></p>` : ""}
                        ${movieData.imdb_rating ? `<p class="imdb"><span class="gray">IMDb:</span> <span class="white">${movieData.imdb_rating} / 10</span></p>` : ""}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Error fetching movie data:", error);
            this.shadowRoot.innerHTML = `<style>${this.getStyles()}</style><p>Error fetching movie data. Please try again later. ${error.message}</p> `;
        }
    }

    getStyles() {
        return `:host {
                display: contents;
            }
            img.poster {
                width: 300px; height: auto; object-fit: cover; margin-right: 2rem; border-radius: 10px;
            }
            .details-content {
                flex: 1; color: var(--text-color, #eee);
            }
            h1 {
                font-size: 2.5rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem; color: var(--primary-color, #e50914);
            }
            .rating {
                border: 1px solid var(--text-color, #eee); padding: 0.2em 0.6em; border-radius: 4px; font-size: 0.8rem; font-weight: bold; vertical-align: middle; margin-left: 10px;
            }
            .age-pg { border-color: lightgreen; color: lightgreen; }
            .age-r { border-color: red; color: red; }
            .age-pg13 { border-color: orange; color: orange; } /* Example for PG-13 */
            .age-g { border-color: lightblue; color: lightblue; } /* Example for G */
            /* Add more rating classes as needed */
            p { margin-bottom: 1rem; line-height: 1.6; }
            .info-details { margin-top: 1.5rem; border-top: 1px solid var(--border-color, #555); padding-top: 1rem; }
            .info-details p { margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
            .gray { color: var(--text-secondary-color, #aaa); font-weight: bold; }
            .white { color: var(--text-color, #eee); }
            .cc-icon { height: 1em; width: 1em; fill: var(--text-secondary-color, #aaa); vertical-align: middle; margin-right: 0.25em; }
            @media (max-width: 768px) {
                 img.poster { width: 100%; max-width: 250px; margin-right: 0; margin-bottom: 1rem; }
                 h1 { font-size: 1.8rem; }
            }
            /* Add styles for genres and imdb if needed */
            .genres .white, .imdb .white { font-weight: normal; }`;
    }
}
customElements.define("movie-details", MovieDetails);

