$(document).ready(function () {
    //=== Get Ids ===
    let videogameDataListSearchField = $("#Videogame-Datalist-Searchfield");
    let videogameDataList = $("#videogame-datalist");
    let yearDatalistSearchfield = $("#Year-Datalist-Searchfield");
    let yearDataList = $("#year-datalist");
    let genreList = $("#Genre-List");
    let ratingList = $("#Rating-List");
    let listingVideogames = $("#Listing-Videogames");

    //=== Variables for Populating Data
    let videogames = [];
    let filteredVideogames = [];
    let titles = [];
    let releaseYears = [];
    let genres = [];
    let platforms = [];
    let ratings = [];
    let pegiRatings = [];
    let prices = [];

    //=== Input Variables ===
    let videogameTitle;
    let fullYear;
    let genreType;
    let rating;

    //=== Application Logic Start
    var settings = {
        "url": "https://localhost:44312/api/VideogameApi",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done((data) => StartApplication(data))

    function StartApplication(data) {
        //=== Initialize Data ===
        //===================== 1 Get Videogames =======================
        videogames = data;

        //===================== 2 Get Videogame Titles =======================
        titles = data.map(x => x.Title);
        titles.sort();

        //===================== 3 Get Videogame Release years =======================
        let dates = data.map(x => x.DateReleased);
        dates.forEach(function (date) {
            let year = new Date(date).getFullYear();
            releaseYears.push(year);
        })
        releaseYears = [...new Set(releaseYears)];
        releaseYears.sort();
        
        //===================== 4 Get Videogame Genres =======================
        data.map(x => x.Genres.forEach(function (genre) {
            if (genre.includes('_')) {
                genre = genre.replace(/[^a-zA-Z ]/g, " ");
            }
            genres.push(genre);
        }));
        genres = [...new Set(genres)];
        genres.sort();

        //===================== 5 Get Videogame Ratings =======================
        //ratings = data.map(x => x.Rating);
        ratings = [...new Set(data.map(x => x.Rating))];
        ratings.sort();

        //=== Construct DOM Search and Filter===
        //===================== 1 Populate Data for Search Autocomplete =======================
        AppendOptionsToListService(videogameDataList, titles);

        //===================== 2 Populate Data for Year Autocomplete =======================
        AppendOptionsToListService(yearDataList, releaseYears);

        //===================== 3 Populate Data for Genre Dropdown =======================
        AppendOptionsToListService(genreList, genres);

        //=== Add event listeners (Input logic) ===
        videogameDataListSearchField.on("input", function () {
            videogameTitle = $(this).val();
            Controller();
        })

        yearDatalistSearchfield.on("input", function () {
            fullYear = $(this).val();
            Controller();
        })

        genreList.on("input", function () {
            genreType = $(this).val();
            Controller();
        })

        ratingList.on("input", function () {
            rating = $(this).val();
            Controller();
        })



        //=== Controller ===
        Controller();
        function Controller() {
            filteredVideogames = videogames;

            //Filtering...
            if (videogameTitle) {
                filteredVideogames = filteredVideogames.filter(x => x.Title.toLowerCase().includes(videogameTitle.toLowerCase()))
            }
            if (fullYear) {
                filteredVideogames = filteredVideogames.filter(x => x.DateReleased >= fullYear);
            }
            if (genreType) {
                filteredVideogames = filteredVideogames.filter(x => ReplaceSpecialCharsOfArrayItems(x.Genres).includes(genreType));
            }
            if (rating) {
                switch (rating) {
                    case "Poor (0-3)": filteredVideogames = filteredVideogames.filter(x => x.Rating <= 3);
                    case "Average (3-6)": filteredVideogames = filteredVideogames.filter(x => x.Rating > 3 && x.Rating <= 6);
                    case "Very Good (6-8)": filteredVideogames = filteredVideogames.filter(x => x.Rating > 6 && x.Rating <= 8);
                    case "Excellent (8-10)": filteredVideogames = filteredVideogames.filter(x => x.Rating > 8 && x.Rating <= 10);
                }
            }
            //Sorting...


            //View...
            listingVideogames.empty();
            filteredVideogames.forEach(ViewVideogames);
        }

        function ViewVideogames(videogame) {
            let photoUrl = videogame.PhotoUrl;
            let rating = videogame.Rating;
            let title = videogame.Title;
            let genres = ReplaceSpecialCharsOfArrayItems(videogame.Genres);
            let platforms = ReplaceSpecialCharsOfArrayItems(videogame.Platforms);
            let dateReleased = videogame.DateReleased;
            let userRating = videogame.UserRating;
            let trailerUrl = videogame.TrailerUrl;
            let priceBeforeDiscount = (videogame.Price * 1.20).toFixed(2);
            let price = videogame.Price;


            let template = `
                <div class="videogame-info">
                    <div class="photo" style="background: url(${photoUrl})">
                        <span class="fa fa-cart-plus"></span>
                        <span class="fa fa-star">
                            <span class="rating-number">${rating}</span>
                        </span>
                    </div>
                    <div class="about-game">
                        <div class="game-title">
                            <h3>${title}</h3>
                        </div>
                        <div class="game-details">
                            <div class="genre">
                                <span>
                                    <strong>Genre(s): </strong>
                                    <span>${genres}</span>
                                </span>
                            </div>
                            <div class="platforms">
                                <span>
                                    <strong>Platforms: </strong>
                                    <span>${platforms}</span>
                                </span>
                            </div>
                            <div class="publish-date">
                                <span>
                                    <strong>Released: </strong>
                                    ${dateReleased}
                                </span>
                            </div>
                            <div class="rating">
                                <span>
                                    <strong>User Rating: </strong>
                                </span>
                                <span>${userRating}</span>
                                <span class="fa fa-star"></span>
                            </div>
                        </div>
                    </div>
                    <div class="videogame-trailer">
                        <div id="TrailerPlayBtn${videogame.VideogameId}" class="trailer-play-btn">
                            <button>
                                <span class="fa fa-play"></span>
                            </button>
                        </div>
                        <div class="redirect-to-youtube">
                            <span>Watch On</span>
                            <a href="${trailerUrl}" target="_blank">
                                <div class="youtube-icon">
                                    <div>
                                        <span class="fa fa-play"></span>
                                    </div>
                                    <span class="youtube-title">Youtube</span>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="actions">
                        <div class="price-info">
                            <div class="before-discount">
                                <strong>Original Price</strong>
                                <strike>
                                    <span>$${priceBeforeDiscount}</span>
                                </strike>
                            </div>
                            <div class="after-discount">
                                <strong>Current Offer</strong>
                                <span>$${price}</span>
                            </div>
                        </div>
                        <div class="action-btns">
                            <div class="cart-btn">
                                <button>Add to Cart <i class="fa fa-cart-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                                `;

            let element = $(template);
            listingVideogames.append(element);
        }
    }

    //=== Services ===
    function AppendOptionsToListService(list, items) {
        items.forEach(function (item) {
            list.append(`<option value="${item}">${item}</option>`)
        })
    }

    function ReplaceSpecialCharsOfArrayItems(arr) {
        let finalArray = [];
        arr.forEach(function (item) {
            if (item.includes('_')) {
                item = item.replace(/[^a-zA-Z ]/g, " ");
            }
            finalArray.push(item);
        })
        return finalArray;
    }

})

