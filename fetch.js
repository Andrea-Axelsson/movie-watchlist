import { renderMovies, renderWatchlist } from './render.js'
import searchMovie from './fetch.js'
import { handleAddMovieClick, handleRemoveMovieClick } from './buttons.js'

// Funktion för att söka efter filmer baserat på användarens inmatning.
function searchMovie(e) {
    e.preventDefault()

    // Använd fetch för att hämta filmdata från en API-tjänst (OMDb).
    fetch(`https://www.omdbapi.com/?s=${titleInput.value}&apikey=c7799550`)
        .then((res) => res.json())
        .then((data) => {
            moviesArray = data.Search || []

            // Skapa en array med löften för att hämta detaljerad information om varje film.
            const fetchDetailsPromises = moviesArray.map((movie) =>
                fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=c7799550`)
                    .then((res) => res.json())
            )

            // Vänta på att alla löften ska slutföras och uppdatera filmobjekten med detaljerad information.
            Promise.all(fetchDetailsPromises).then((movieDetailsArray) => {
                moviesArray.forEach((movie, index) => {
                    movie.details = movieDetailsArray[index];
                })
                // Rendera filmerna baserat på den hämtade informationen.
                renderMovies()
            })
        })
}

export default searchMovie