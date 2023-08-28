let moviesArray = []

const titleInput = document.getElementById("title-input")
const submitBtn = document.getElementById("submit-btn")

submitBtn.addEventListener("click", searchMovie)

function renderMovies(){
    let html = ""
    for (let movie of moviesArray){
        fetch (`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=c7799550`)
            .then(res => res.json())
            .then(movieDetails =>{
                html += `
        <main class="movie">
                <div>
                    <img class="movie-poster"src="${movie.Poster}" alt="Image of movie poster">
                </div>
                        <div class="movie-info">
                            <div class="movie-details">
                                <h2>${movie.Title}</h2>
                                <p>⭐ ${movieDetails.imdbRating}</p>
                            </div>
                            
                                <div class="movie-details">
                                    <p>${movieDetails.Runtime}</p>
                                    <p>${movieDetails.Genre}</p>
                                        <div class="watchlist-btn">
                                            <i class="fa-solid fa-circle-plus"></i>
                                            <p>Watchlist</p>
                                        </div>
                                </div>
                            <p>${movieDetails.Plot}</p>
                        </div>
                </main>
                <hr>
        `
        document.getElementById("movie-container").innerHTML = html
            })
         
    }
    
}

function searchMovie(e){
    e.preventDefault()
    
    fetch(`https://www.omdbapi.com/?s=${titleInput.value}&apikey=c7799550`)
    .then(res => res.json())
    .then(data => {
        moviesArray = data.Search
        renderMovies()
        console.log("ARRAY", moviesArray)
    })
}



/* function searchMovie(e){
    e.preventDefault()
    console.log("btn clicked")
    console.log(titleInput.value)
}

    
    

/* let moviesArray = []

const titleInput = document.getElementById("title-input")
const submitBtn = document.getElementById("submit-btn")

submitBtn.addEventListener("click", searchMovie)


function searchMovie(e){
    e.preventDefault()
    
    fetch(`https://www.omdbapi.com/?s=${titleInput.value}&apikey=c7799550`)
    .then(res => res.json())
    .then(data => console.log(data))
}
 */