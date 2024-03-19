//OpenWeather API call
var getCityForecast = function(city) {

    //Variable for OpenWeather API link with API key and imperial unit parameter
    var callOpenWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6d920e83bac9f69207691c8489e7e7fc&units=imperial";

    //Fetch method to retrieve city data from OpenWeather API
    fetch(callOpenWeatherAPI)
    
    //.then function for API response
    .then(function(response) {

        if (response.ok) {response.json().then(function(data) {forecastDisplay(data);});
    
        } else {alert("Error: " + response.statusText);}})

    //.catch error and alert for no reponse from OpenWeather server
    .catch(function(error) {alert("Error reaching OpenWeather server.");})
};

//Retrieve data for city entered in search field
var citySearch = function(event) {

    event.preventDefault();

    //Take search form input and pass it to the getCityForecast function
    var cityInput = $("#city_searched").val().trim();

    if(cityInput) {
        getCityForecast(cityInput);

        //Clears the search input field
        $("#city_searched").val("");

    } else {
        alert("Please enter a valid city.");
    }
};


//Function to print forecast data to page from API call
var forecastDisplay = function (forecastData) {

    //Current city forecast display format

        //Pull city info and weather image from OpenWeather and acquire date from DayJS
        $("#current_city").text(forecastData.name + " (" + dayjs(forecastData.dt * 1000).format("MM-D-YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" />`);
        $("#current_city_temp").text("Temperature: " + forecastData.main.temp.toFixed(1) + "°F");
        $("#current_city_wind").text("Wind: " + forecastData.wind.speed.toFixed(1) + " mph");
        $("#current_city_humid").text("Humidity: " + forecastData.main.humidity + "%");

        //Fetch method to retrieve 5-day forecast data from OpenWeather API
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + forecastData.name + "&appid=6d920e83bac9f69207691c8489e7e7fc&units=imperial")

        //.then function for API response
        .then(function(response) {
            response.json().then(function(data) {

                //Clear any existing data from the #5_day_forecast element
                $("#5_day_forecast").empty();

                //Loop to retrieve data for every 24 hours from API call
                for(i = 7; i <= data.list.length; i += 8) {

                    //5-day forecast display format
                    var fiveDayCard =`
                    <div class="col-md-2 card text-light fw-light bg-secondary">
                        <div class="card-body p-1">
                            <h3 class="card-title fs-5">` + dayjs(data.list[i].dt * 1000).format("MM-D-YYYY") + `</h3>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" />
                            <p class="card-text">Temp: ` + data.list[i].main.temp + "°F" + `</p>
                            <p class="card-text">Wind: ` + data.list[i].wind.speed + " mph" + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + "%" + `</p>
                        </div>
                    </div>
                    `;

                //Append current date to 5-day forecast card
                $("#5_day_forecast").append(fiveDayCard);
                }
            })
        });


//Local storage save operations:

var lastCitySearched = ""
var citySearchHistory = []

//Redeclare lastCitySearched var with API data of the last city searched
lastCitySearched = forecastData.name

//Use API city data to save search history
saveSearchHistory(forecastData.name);

};

//Save search history to local storage
var saveSearchHistory = function(city) {

    //Create search history link for the city searched
    if(!citySearchHistory.includes(city)) {
        citySearchHistory.push(city);
        $("#search_history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    }

    //Save search history as an array in local storage
    localStorage.setItem("forecastSearchHistory", JSON.stringify(citySearchHistory));

    //Save the last city searched to local storage
    localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));

    //Retrieve search history from local storage
    printSearchHistory();
}

//Function to print saved search history data from local storage
var printSearchHistory = function() {
    citySearchHistory = JSON.parse(localStorage.getItem("forecastSearchHistory"));
    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched"));

    //Search history string and array are empty if local storage is empty
    if (!citySearchHistory) {
        citySearchHistory = []
    }

    if (!lastCitySearched) {
        lastCitySearched = ""
    }

    //Clear previous search history from ul
    $("#search_history").empty();

    //Loop through cities in search history array
    for(i=0;i<citySearchHistory.length;i++) {

        //Create a link for each city in the search history array
        $("#search_history").append("<a href='#' class='list-group-item list-group-item-action' id='" + citySearchHistory[i] + "'>" + citySearchHistory[i] + "</a>");
    }
};

//Print search history from local storage to the page
printSearchHistory();

//Print API data to page for last city searched if there is a city in search history
if (lastCitySearched !="") {
    getCityForecast(lastCitySearched);
}

$("#search_form").submit(citySearch);
$("#search_history").on("click", function(event) {
    var lastCity = $(event.target).closest("a").attr("id");
    getCityForecast(lastCity);
});