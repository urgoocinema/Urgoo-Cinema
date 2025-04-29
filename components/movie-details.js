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
      const imdbRating = movieData.imdb_rating || "";
      const description = movieData.description || "No description available.";
      const cast = movieData.cast ? movieData.cast.join(", ") : "N/A"; // Join cast array
      const duration = movieData.duration || "N/A"; // Assuming JSON has duration
      const language =
        movieData.cc === "mongolian"
          ? "Монгол хэл"
          : movieData.cc
            ? "Англи хэл"
            : "N/A"; // Assuming JSON has cc field
      const grayTextColor = '#aaa'; // Example
      const whiteTextColor = '#eee'; // Example
      const bodyBackgroundColor = '#222'; // Example

      this.shadowRoot.innerHTML = `

            <style>
          /* Style the component ('host') itself */
          :host {
            display: flex;
            gap: 3rem; /* Adjusted gap slightly */
            padding: 20px; /* Add some padding */
            background-color: ${bodyBackgroundColor}; /* Match outer background? */
            color: ${whiteTextColor}; /* Default text color */
            font-family: 'Manrope', sans-serif; /* Apply font */
            border-radius: 8px; /* Optional rounded corners */
            max-width: 900px; /* Optional max width */
            margin: 20px auto; /* Optional centering */
            box-shadow: 0 4px 8px rgba(0,0,0,0.3); /* Optional shadow */
          }

          /* Style elements directly inside the shadow DOM */
          img {
            /* height: 50vh; Maybe use max-height or max-width instead? */
            max-height: 450px; /* Example max height */
            max-width: 300px; /* Example max width */
            width: auto; /* Maintain aspect ratio */
            height: auto; /* Maintain aspect ratio */
            object-fit: cover;
            box-shadow: 0 0 15px rgb(228, 155, 15), 0 0 30px rgba(255, 255, 255, 0.1);
            border-radius: 8px; /* Consistent rounding */
            align-self: flex-start; /* Align image to the top */
          }

          /* Style the main text container div */
          div {
            display: flex;
            flex-direction: column;
            gap: 1.5rem; /* Adjust gap inside text container */
            flex: 1; /* Allow text container to grow */
          }

          h1 {
            font-size: 2.5rem; /* Slightly smaller */
            margin: 0; /* Remove default margin */
            color: #fff; /* Ensure white heading */
            display: flex; /* Align rating nicely */
            align-items: center;
            gap: 10px;
          }

          .rating {
             /* Add styles for your rating span */
             font-size: 0.8em;
             padding: 3px 8px;
             border-radius: 4px;
             font-weight: bold;
             line-height: 1; /* Ensure consistent height */
          }
          .age-pg { /* Assuming this class is for the rating */
             background-color: orange;
             color: black;
          }

          p {
            line-height: 1.6; /* Improved readability */
            margin: 0; /* Remove default paragraph margin */
          }

          /* Style the inner div containing details */
          div > div {
             margin-top: 1rem; /* Add some space above details block */
             display: flex;
             flex-direction: column;
             gap: 0.8rem; /* Space between detail lines */
          }

          .gray {
            color: ${grayTextColor};
            margin-right: 8px; /* Space after label */
            font-weight: 500;
          }

          .white {
            color: ${whiteTextColor};
          }

          /* Specific detail paragraphs if needed */
          .cast, .duration, .lang, .imdb {
             /* Add specific styles if needed */
          }

        </style>
                <img src=".${posterSrc}" alt="${movieTitle} poster}" />
      <div>
        <h1>${movieTitle}<span class="rating age-pg">${ratingText}</span></h1>
        <p>
          ${description}
        </p>
        <p>
          ${description}
        </p>
        <div>
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
            <span class="gray">Хэл:</span>
            <span class="white">${language}</span>
          </p>
          <p class="imdb">
            <span class="gray">IMDB: </span>
            <span class="white">${imdbRating}</span>
          </p>
        </div>
      </div>
            `;
    } catch (error) {
      console.error("Error fetching movie data:", error);
      this.shadowRoot.innerHTML = `<p>Error fetching movie data. Please try again later. ${error.message}</p> `;
    }
  }
}
customElements.define("movie-details", MovieDetails);
