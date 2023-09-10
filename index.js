import { renderMovies, renderWatchlist } from './render.js'
import searchMovie from './fetch.js'

// En array för att lagra filmobjekt.
let moviesArray = []

// En array för att lagra tillagda filmobjekt (till watchlist).
let addedFilmArray = []

// Hämta en referens till ett HTML-element med id "title-input".
const titleInput = document.getElementById("title-input")

// Hämta en referens till ett HTML-element med id "submit-btn".
const submitBtn = document.getElementById("submit-btn")

// Lägg till en händelselyssnare på knappen för att söka efter filmer.
if (submitBtn) {
    submitBtn.addEventListener("click", searchMovie)
}

// Lägg till en händelselyssnare som körs när sidan laddas.
window.addEventListener("load", () => {

    // Hämta sparade filmer från webblager (localStorage).
    const moviesFromLocalStorage = JSON.parse(localStorage.getItem("myMovies"))

    // Om det finns sparade filmer, lägg till dem i "addedFilmArray" och rendera watchlist.
    if (moviesFromLocalStorage) {
        addedFilmArray = moviesFromLocalStorage
        renderWatchlist()
    }
})

// Lägg till en händelselyssnare för klick på dokumentet för att hantera "Lägg till" och "Ta bort" filmknappar.
document.addEventListener("click", function (e) {

    // Om det finns ett attribut "data-add" på det klickade elementet, hantera "Lägg till" klick.
    if (e.target.getAttribute("data-add")) {
        handleAddMovieClick(e.target.getAttribute("data-add"))
    }
    // Annars, om det finns ett attribut "data-remove", hantera "Ta bort" klick.
    else if (e.target.dataset.remove) {
        handleRemoveMovieClick(e.target.dataset.remove)
    }
})

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




