class Screenselector extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this._movieId = null;
    }
    static get observedAttributes(){
        return ['movie-id'];
    }
    connectedCallback(){
        this.render();
    }
    attributeChangedCallback(name,oldValue,newValue){
        if(name === "movie-id" && oldValue !== newValue){
            this._movieId = newValue;
            this.render();
        }
    }
    async render(){
        const movieId = this.getAttribute("movie-id")||this._movieId;
        if(!movieId){
            this.shadowRoot.innerHTML = `<p>Please provide a movie ID.</p>`;
            return;
        }
        this.shadowRoot.innerHTML = `<p>Loading...</p>`;
        try{
            const response = await fetch("../data/movies-list.json");

            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMoviesData = await response.json();
            const movieData = allMoviesData.movies.find(
                (movie)=>movie.id.toString() === movieId
            );
            if(!movieData){
                this.shadowRoot.innerHTML = `<p>Movie with ID ${movieId} not found.</p>`;
                return;
            }
            this.shadowRoot.innerHTML = ``;

        } catch (error){
            console.error("Error fetching movie data: ",error);
            this.shadowRoot.innerHTML = `<p>Error fetching movie data. Please try again later. ${error.message}</p> `;
        }
    }
}
customElements.define("screen-selector", Screenselector);