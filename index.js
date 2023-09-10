// Skapar två tomma arrayer för att lagra filmer och filmer som läggs till i watchlist.
let moviesArray = [];
let addedFilmArray = [];

// Hämtar DOM-element för inputfält, sökningsknapp och lägg till i watchlist-knapp.
const titleInput = document.getElementById("title-input");
const submitBtn = document.getElementById("submit-btn");


// Lägger till en händelselyssnare på sökningsknappen för att utföra sökningen när användaren klickar.
if (submitBtn) {
    submitBtn.addEventListener("click", searchMovie);
}


// Lägger till en händelselyssnare som körs när sidan laddas.
window.addEventListener("load", () => {
    // Hämtar filmer från lokal lagring om de finns och uppdaterar addedFilmArray med dem.
    const moviesFromLocalStorage = JSON.parse(localStorage.getItem("myMovies"));
    if (moviesFromLocalStorage) {
        addedFilmArray = moviesFromLocalStorage;
        // Renderar watchlist med de sparade filmerna.
        renderWatchlist();
    }
});

// Lägger till en händelselyssnare som reagerar på klick på DOM-dokumentet.
document.addEventListener("click", function (e) {
    // Kollar om det klickade elementet har ett "data-add" attribut.
    if (e.target.getAttribute("data-add")) {
        // Hanterar klicket på "Lägg till i watchlist" genom att anropa handleAddMovieClick-funktionen.
        handleAddMovieClick(e.target.getAttribute("data-add"));
    } else if (e.target.dataset.remove) {
        handleRemoveMovieClick(e.target.dataset.remove)
    }
});

function handleRemoveMovieClick(removeMovieId) {
    const movieIndexToRemove = addedFilmArray.findIndex((movie) => movie.imdbID === removeMovieId)

    if (movieIndexToRemove !== -1) {
        addedFilmArray.splice(movieIndexToRemove, 1)
        localStorage.setItem("myMovies", JSON.stringify(addedFilmArray))

        if (window.location.pathname.includes("my-watchlist.html")) {
            location.reload()
        }
        else {
            renderMovies()
        }
    }
}

// Funktion som hanterar klick på "Lägg till i watchlist" knappen för en specifik film.
function handleAddMovieClick(addMovieId) {
    // Filtrerar filmen med hjälp av dess IMDb-ID och lägger till den i addedFilmArray.
    const targetMovie = moviesArray.filter(function (movie) {
        return movie.imdbID === addMovieId;
    })[0];

    if (targetMovie) {
        addedFilmArray.push(targetMovie);
        // Sparar den uppdaterade watchlist i lokal lagring.
        localStorage.setItem("myMovies", JSON.stringify(addedFilmArray));
        // Renderar filmerna igen för att uppdatera gränssnittet.
        renderMovies();
    }
}

// Funktion för att söka efter filmer baserat på användarens inmatning.
function searchMovie(e) {
    e.preventDefault();

    // Använder fetch för att hämta filmer från OMDB API med den angivna titeln.
    fetch(`https://www.omdbapi.com/?s=${titleInput.value}&apikey=c7799550`)
        .then((res) => res.json())
        .then((data) => {
            moviesArray = data.Search || [];

            // Skapar en array med löften för att hämta detaljer om varje film.
            const fetchDetailsPromises = moviesArray.map((movie) =>
                fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=c7799550`)
                    .then((res) => res.json())
            );

            // Väntar på att alla löften ska slutföras och lägger till detaljer till varje film.
            Promise.all(fetchDetailsPromises).then((movieDetailsArray) => {
                moviesArray.forEach((movie, index) => {
                    movie.details = movieDetailsArray[index];
                });
                // Renderar filmerna med detaljer.
                renderMovies();
            });
        });
}

// Funktion för att rendera filmerna i sökresultatet.
function renderMovies() {
    let searchHtml = "";

    if (moviesArray.length === 0) {
        // Display the message when the watchlist is empty
        searchHtml = `
        <div class="empty-list">
        <h3>Unable to find what you’re looking for. 
        <br>
        Please try another search.</h3>
    </div>
        `;
    } else {
        // Render each movie in the watchlist
        for (let movie of moviesArray) {
            const details = movie.details

            const isInWatchlist = addedFilmArray.some((addedMovie) => addedMovie.imdbID === movie.imdbID)
            let buttonContent = "Watchlist"
            let icon = "fa-solid fa-circle-plus"
            let id = "add"

            if (isInWatchlist) {
                buttonContent = "Remove"
                icon = "fa-solid fa-circle-minus"
                id = "remove"
            } else {
                buttonContent = "Watchlist"
                icon = "fa-solid fa-circle-plus"
                id = "add"
            }

            // Skapar HTML för varje film och lägger till den i sökresultatet.
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
        `;
        }

        // Uppdaterar innehållet i filmcontainer med HTML för de hittade filmerna.
        const movieContainer = document.getElementById("movie-container");
        if (movieContainer) {
            movieContainer.innerHTML = searchHtml;
        }
    }

}

// Funktion för att rendera filmerna i watchlist.
function renderWatchlist() {
    let watchListHtml = "";

    // Check if addedFilmArray is empty
    if (addedFilmArray.length === 0) {
        // Display the message when the watchlist is empty
        watchListHtml = `
            <div class="empty-list">
                <h3>Your watchlist is looking a little empty...</h3>
                <div class="watchlist-btn" onclick="window.location.href = 'index.html'">
                    <i class="fa-solid fa-circle-plus"></i>
                    <p>Let’s add some movies!</p>
                </div>
            </div>
        `;
    } else {
        // Render each movie in the watchlist
        for (let addMovie of addedFilmArray) {
            const details = addMovie.details;

            // Skapar HTML för varje film i watchlist och lägger till den i watchlist-container.
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
            `;
        }
    }

    // Uppdaterar innehållet i watchlist-container med HTML för de sparade filmerna eller tommeddelandet.
    const watchlistContainer = document.getElementById("watchlist-container");
    if (watchlistContainer) {
        watchlistContainer.innerHTML = watchListHtml;
    }
}