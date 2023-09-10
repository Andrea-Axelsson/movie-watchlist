// Funktion för att hantera klick på "Ta bort" filmknapp.
function handleRemoveMovieClick(removeMovieId) {
    // Hitta index för filmen som ska tas bort i "addedFilmArray".
    const movieIndexToRemove = addedFilmArray.findIndex((movie) => movie.imdbID === removeMovieId);

    // Om filmen finns i "addedFilmArray", ta bort den och uppdatera localStorage.
    if (movieIndexToRemove !== -1) {
        addedFilmArray.splice(movieIndexToRemove, 1);
        localStorage.setItem("myMovies", JSON.stringify(addedFilmArray));

        // Om sidan är "my-watchlist.html", ladda om sidan.
        if (window.location.pathname.includes("my-watchlist.html")) {
            location.reload();
        }
        // Annars, rendera filmerna igen.
        else {
            renderMovies();
        }
    }
}

// Funktion för att hantera klick på "Lägg till" filmknapp.
function handleAddMovieClick(addMovieId) {
    // Filtrera målfilmen från "moviesArray" och lägg till den i "addedFilmArray".
    const targetMovie = moviesArray.filter(function (movie) {
        return movie.imdbID === addMovieId;
    })[0];

    if (targetMovie) {
        addedFilmArray.push(targetMovie);
        localStorage.setItem("myMovies", JSON.stringify(addedFilmArray));
        renderMovies();
    }
}

// Funktion för att rendera watchlist med sparade filmer.
function renderWatchlist() {
    let watchListHtml = "";

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
        `;
    } else {
        // Skapa HTML för varje film i watchlist och dess detaljer.
        for (let addMovie of addedFilmArray) {
            const details = addMovie.details;

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
            `;
        }
    }

    // Uppdatera HTML-innehållet på sidan med watchlist.
    const watchlistContainer = document.getElementById("watchlist-container");
    if (watchlistContainer) {
        watchlistContainer.innerHTML = watchListHtml;
    }
}

// Exportera funktioner
export { handleRemoveMovieClick, handleAddMovieClick, renderWatchlist, renderMovies };