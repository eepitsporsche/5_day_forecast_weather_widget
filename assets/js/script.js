//OpenWeather API call
var getCityForecast = function (city) {

    //Variable for OpenWeather API link with API key and imperial unit parameter
    var callOpenWeatherAPI = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6d920e83bac9f69207691c8489e7e7fc&units=imperial";

    //Fetch method to retrieve city data from OpenWeather API
    fetch(callOpenWeatherAPI)

    //.then function for API response
    .then(function(reponse) {

        if (reponse.ok) {response.json().then(function(data) {forecastDisplay(data);})
    
        } else {alert("Error: " + reponse.statusText)}})

    //.catch error and alert for no reponse from OpenWeather server
    .catch(function(error) {alert("Error reaching OpenWeather server.")})
};

//Retrieve data for city entered in search field
var citySearch = function(event) {

    event.preventDefault();

    //Take search form input and pass it to the getCityForecast function
    var cityInput = $("#city_searched").val().trim();

    if(cityInput) {
        getCityForecast(cityInput);

        $("#city_searched").val("");

    } else {
        alert("Please enter a valid city.");
    }
};


//Function to print forecast data to page from API call
var printForecast = function (forecastData) {

    //Current city forecast display format

        //Pull city info and weather image from OpenWeather and acquire date from DayJS
        $("#current_city").text(forecastData.name + " (" + dayjs(forecastData.dt * 1000).format("MM-D-YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" />`);
        $("#current_city_temp").text("temperature: " + forecastData.main.temp.toFixed(1) + "°F");
        $("#current_city_wind").text("Wind: " + forecastData.wind.speed.toFixed(1) + " mph");
        $("#current_city_humid").text("Humidity: " + forecastData.main.humidity + "%");

        //Fetch method to retrieve 5-day forecast data from OpenWeather API
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + forecastData.name + "&appid=6d920e83bac9f69207691c8489e7e7fc&units=imperial")

        //.then function for API response
        .then(function(response) {
            response.json().then(function(data) {

                //Clear any existing data from the #5_day_forecast element
                $("#5_day_forecast").empty();

                //Loop to retrieve data every 24 hours from API call
                for(i=7;i<=data.list.length; i=8) {

                    //5-day forecast display format
                    var fiveDayCard =`
                    <div class="col-md-2 card text-secondary bg-light">
                        <div class="card-body p-1">
                            <h4 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM-D-YYYY") + `</h4>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" />
                            <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

                //Append current date to 5-day forecast card
                $("#5_day_forecast").append(fiveDayCard);
                }
            })
        });


    }