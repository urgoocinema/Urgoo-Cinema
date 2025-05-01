class Screenselector extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this._movieId = null;
        this._selectedTheater = null; // Store the selected theater
        this._movieData = null; // Store fetched movie data

        // Bind the event handler method to the instance
        this._handleTheaterSelected = this._handleTheaterSelected.bind(this);
    }
    static get observedAttributes(){
        return ['movie-id'];
    }
    connectedCallback(){
        // Listen for the custom event dispatched by theater-selector
        // Attach listener to a common ancestor or document if components are far apart
        // For simplicity, attaching to `document` here. Adjust if needed.
        document.addEventListener('theater-selected', this._handleTheaterSelected);
        this.fetchMovieData(); // Fetch data initially
    }

    disconnectedCallback() {
        // Clean up the event listener when the component is removed from the DOM
        document.removeEventListener('theater-selected', this._handleTheaterSelected);
    }
    attributeChangedCallback(name,oldValue,newValue){
        if(name === "movie-id" && oldValue !== newValue){
            this._movieId = newValue;
            this.fetchMovieData(); // Re-fetch data if movie ID changes
        }
    }
    async render(){
        const movieId = this.getAttribute("movie-id")||this._movieId;
        if(!movieId){
            this.shadowRoot.innerHTML = `<p>Please provide a movie ID.</p>`;
            return;
        }

        if (!this._movieData) {
            this.shadowRoot.innerHTML = `<p>Loading movie data...</p>`;
            return; // Wait for data to be fetched
        }

        if (!this._selectedTheater || this._selectedTheater === "DefaultSelection") {
             this.shadowRoot.innerHTML = `<p>Please select a theater first.</p>`;
             return;
        }

        const theaterShowtimes = this._movieData.showtimes[this._selectedTheater];

        if (!theaterShowtimes) {
            this.shadowRoot.innerHTML = `<p>No showtimes available for ${this._selectedTheater}.</p>`;
            return;
        }

        // --- Render logic using theaterShowtimes ---
        let showtimesHTML = `<style>
            /* Add your styles here */
            .day { margin-bottom: 1em; border: 1px solid #ccc; padding: 1em; }
            .times button { margin: 0.2em; padding: 0.5em; cursor: pointer; }
        </style>`;

        for (const day in theaterShowtimes) {
            showtimesHTML += `
                <div class="day">
                    <h3>${day}</h3>
                    <div class="times">
                        ${theaterShowtimes[day].map(time => `<button>${time}</button>`).join('')}
                    </div>
                </div>
            `;
        }

        this.shadowRoot.innerHTML = showtimesHTML;
        // --- End Render Logic ---
    }

    // Separate function to fetch data
    async fetchMovieData() {
        const movieId = this.getAttribute("movie-id") || this._movieId;
        if (!movieId) return;

        try{
            const response = await fetch("../data/movies-list.json");
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMoviesData = await response.json();
            this._movieData = allMoviesData.movies.find(
                (movie)=>movie.id.toString() === movieId
            );
            this.render(); // Render after fetching data
        } catch (error){
            console.error("Error fetching movie data: ",error);
            this.shadowRoot.innerHTML = `<p>Error fetching movie data: ${error.message}</p>`;
            this._movieData = null; // Reset movie data on error
        }
    }
}
customElements.define("screen-selector", Screenselector);