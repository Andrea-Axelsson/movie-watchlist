import { renderMovies, renderWatchlist } from './render.js'
import searchMovie from './fetch.js'
import { handleAddMovieClick, handleRemoveMovieClick } from './buttons.js'

// Funktion för att hantera klick på "Ta bort" filmknapp.
function handleRemoveMovieClick(removeMovieId) {
    // Hitta index för filmen som ska tas bort i "addedFilmArray".
    const movieIndexToRemove = addedFilmArray.findIndex((movie) => movie.imdbID === removeMovieId)

    // Om filmen finns i "addedFilmArray", ta bort den och uppdatera localStorage.
    if (movieIndexToRemove !== -1) {
        addedFilmArray.splice(movieIndexToRemove, 1)
        localStorage.setItem("myMovies", JSON.stringify(addedFilmArray))

        // Om sidan är "my-watchlist.html", ladda om sidan.
        if (window.location.pathname.includes("my-watchlist.html")) {
            location.reload()
        }
        // Annars, rendera filmerna igen.
        else {
            renderMovies()
        }
    }
}

// Funktion för att hantera klick på "Lägg till" filmknapp.
function handleAddMovieClick(addMovieId) {
    // Filtrera målfilmen från "moviesArray" och lägg till den i "addedFilmArray".
    const targetMovie = moviesArray.filter(function (movie) {
        return movie.imdbID === addMovieId;
    })[0]

    if (targetMovie) {
        addedFilmArray.push(targetMovie);
        localStorage.setItem("myMovies", JSON.stringify(addedFilmArray));
        renderMovies();
    }
}

export { handleAddMovieClick, handleRemoveMovieClick }