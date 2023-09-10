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
        handleAddMovieClick(e.target.getAttribute("data-add"));
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