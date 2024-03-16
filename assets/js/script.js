//Open weather API call
var getCityForecast = function (city) {
    var callOpenWeatherAPI = "api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6d920e83bac9f69207691c8489e7e7fc";


    //Fetch method to retrieve data from OpenWeather API
    fetch(callOpenWeatherAPI)

    //.then for call back return function
    .then(function(reponse) {

        if (reponse.ok) {response.json().then(function(data) {forecastDisplay(data);})
    
        } else {alert("Error: " + reponse.statusText)}})

    //.catch error and alert for no reponse from OpenWeather server
    .catch(function(error) {alert("Error reaching OpenWeather server.")})
}