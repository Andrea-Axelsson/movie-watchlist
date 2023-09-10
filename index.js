import { renderMovies, renderWatchlist } from './render.js'
import searchMovie from './fetch.js'
import { handleAddMovieClick, handleRemoveMovieClick } from './buttons.js'

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




