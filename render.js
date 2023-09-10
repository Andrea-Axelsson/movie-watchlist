import { renderMovies, renderWatchlist } from './render.js'
import searchMovie from './fetch.js'
import { handleAddMovieClick, handleRemoveMovieClick } from './buttons.js'

// Funktion för att rendera sökresultatet på sidan.
function renderMovies() {
    let searchHtml = ""

    // Skapa HTML för varje film i "moviesArray".
    if (moviesArray.length === 0) {
        // Meddelande om inga sökresultat hittades.
        searchHtml = `
        <div class="empty-list">
        <h3>Unable to find what you’re looking for. 
        <br>
        Please try another search.</h3>
    </div>
        `
    } else {
        // Skapa HTML för varje film och dess detaljer.
        for (let movie of moviesArray) {
            const details = movie.details

            // Avgör om filmen finns i watchlist och justera knappens innehåll och ikon.
            const isInWatchlist = addedFilmArray.some((addedMovie) => addedMovie.imdbID === movie.imdbID)
            let buttonContent = "Watchlist"
            let icon = "fa-solid fa-circle-plus"
            let id = "add"

            if (isInWatchlist) {
                buttonContent = "Remove"
                icon = "fa-solid fa-circle-minus"
                id = "remove"
            }

            // Skapa HTML för filmen och knappen.
            searchHtml += `
        <main class="movie">
            <!-- Filmens posterbild -->
            <div>
                <img class="movie-poster" src="${details.Poster}" alt="Image of movie poster">
            </div>
            <div class="movie-info">
                <div class="movie-details">
                    <h2>${details.Title}</h2>
                    <p>⭐ ${details.imdbRating}</p>
                </div>
                <div class="movie-details">
                    <p>${details.Runtime}</p>
                    <p>${details.Genre}</p>
                    <div class="watchlist-btn">
                        <i class="${icon}" data-${id}="${movie.imdbID}"></i>
                        <p data-${id}="${movie.imdbID}">${buttonContent}</p>
                    </div>
                </div>
                <p>${details.Plot}</p>
            </div>
        </main>
        <hr>
        `
        }

        // Uppdatera HTML-innehållet på sidan med sökresultatet.
        const movieContainer = document.getElementById("movie-container");
        if (movieContainer) {
            movieContainer.innerHTML = searchHtml;
        }
    }
}

// Funktion för att rendera watchlist med sparade filmer.
function renderWatchlist() {
    let watchListHtml = ""

    // Skapa HTML för varje film i "addedFilmArray".
    if (addedFilmArray.length === 0) {
        // Meddelande om att watchlist är tom.
        watchListHtml = `
            <div class="empty-list">
                <h3>Your watchlist is looking a little empty...</h3>
                <div class="watchlist-btn" onclick="window.location.href = 'index.html'">
                    <i class="fa-solid fa-circle-plus"></i>
                    <p>Let’s add some movies!</p>
                </div>
            </div>
        `
    } else {
        // Skapa HTML för varje film i watchlist och dess detaljer.
        for (let addMovie of addedFilmArray) {
            const details = addMovie.details

            // Skapa HTML för filmen och knappen för att ta bort från watchlist.
            watchListHtml += `
            <main class="movie">
                <!-- Filmens posterbild -->
                <div>
                    <img class="movie-poster" src="${details.Poster}" alt="Image of movie poster">
                </div>
                <div class="movie-info">
                    <div class="movie-details">
                        <h2>${details.Title}</h2>
                        <p>⭐ ${details.imdbRating}</p>
                    </div>
                    <div class="movie-details">
                        <p>${details.Runtime}</p>
                        <p>${details.Genre}</p>
                        <div class="watchlist-btn">
                            <i class="fa-solid fa-circle-minus" data-remove="${addMovie.imdbID}"></i>
                            <p data-remove="${addMovie.imdbID}">Remove</p>
                        </div>
                    </div>
                    <p>${details.Plot}</p>
                </div>
            </main>
            <hr>
            `
        }
    }

    // Uppdatera HTML-innehållet på sidan med watchlist.
    const watchlistContainer = document.getElementById("watchlist-container");
    if (watchlistContainer) {
        watchlistContainer.innerHTML = watchListHtml;
    }
}

export { renderMovies, renderWatchlist }