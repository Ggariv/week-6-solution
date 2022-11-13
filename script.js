// variables
var cityList = [];
var cityName;
// OpenWeatherMap API key = 6bad865260f2640f7863dfb7460f175e
var apiKey = "6bad865260f2640f7863dfb7460f175e"

// storage functions
storeCityList();
storeWeather();

// displaying the city(ies) entered by the user
function renderCities() {
    $("#cityList").empty();
    $("#cityName").val("");
    for (i=0; i<cityList.length; i++) {
        var cityTyped = $("<a>")
        cityTyped.addClass("list-group-item list-group-item-action list-group-item-primary city");
        cityTyped.attr("data-name", cityList[i]);
        cityTyped.text(cityList[i]);
        $("#cityList").prepend(cityTyped);
        }
    }

// pull the city list array from local storage
function storeCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cityList = storedCities;
        }
    renderCities();
    }

// pull the current city into local storage to display the current weather data on reload
function storeWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));
    if (storedWeather !== null) {
        cityName = storedWeather;
        displayWeather();
        displayFiveDayForecast();
        }
    }

// city array to local storage saver
function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(cityList));
    }

// current display city to local storage saver
function storeCurrentCity() {
    localStorage.setItem("cities", JSON.stringify(cityName));
    }

// click event handler for city search button
$("#citySearchBtn").on("click", function(event){
    event.preventDefault();
    cityName = $("#cityInput").val().trim();
    if (cityName === "") {
        alert("Please enter a city to look up");
        }
    else if (cityList.length >=10) {
        cityList.shift();
        cityList.push(cityName);
        }
    else {
        cityList.push(cityName);
        }
    storeCurrentCity();
    storeCityArray();
    renderCities();
    // display functions
    displayWeather();
    displayFiveDayForecast();
    });

// open weather API AJAX call and displays the current city, weather, and 5 day forecast to the DOM
async function displayWeather() {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + apiKey;
    var response = await $.ajax({
        url: queryURL,
        method: "GET"
        })
    // Weather data section
    var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
    var getCurrentCity = response.name;
    // current date
    var date = new Date();
    var val = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
    // current weather icon
    var getCurrentWeatherIcon = response.weather[0].icon;
    var displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + "@2x.png />");
    // current city data
    var currentCityEl = $("<h3 class = 'card-body'>").text(getCurrentCity+"("+val+")");
    currentCityEl.append(displayCurrentWeatherIcon);
    currentWeatherDiv.append(currentCityEl);
    // current temperature data
    var getTemp = response.main.temp.toFixed(1);
    var tempEl = $("<p class='card-text'>").text("Temperature: "+ getTemp +"°F");
    currentWeatherDiv.append(tempEl);
    // current wind-speed data
    var getWindSpeed = response.wind.speed.toFixed(1);
    var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+ getWindSpeed +" mph");
    currentWeatherDiv.append(windSpeedEl);
    // current humidity data
    var getHumidity = response.main.humidity;
    var humidityEl = $("<p class='card-text'>").text("Humidity: "+ getHumidity +"%");
    currentWeatherDiv.append(humidityEl);
    // current UV data
    var getLong = response.coord.lon;
    var getLat = response.coord.lat;
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + getLat + "&lon=" + getLong;
    var uvResponse = await $.ajax({
        url: uvURL,
        method: "GET"
        })
    // getting UV Index info and setting color class according to value
    var getUVIndex = uvResponse.value;
    var uvNumber = $("<span>");
    if (getUVIndex > 0 && getUVIndex <= 2.99) {
        uvNumber.addClass("low");
        }
    else if(getUVIndex >= 3 && getUVIndex <= 5.99) {
        uvNumber.addClass("moderate");
        }
    else if(getUVIndex >= 6 && getUVIndex <= 10.99) {
        uvNumber.addClass("high");
        }
    else{
        uvNumber.addClass("extreme");
        } 
    uvNumber.text(getUVIndex);
    var uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
    uvNumber.appendTo(uvIndexEl);
    currentWeatherDiv.append(uvIndexEl);
    $("#weatherContainer").html(currentWeatherDiv);
    }

// run the ajax call for the 5 day forecast and displays it on the DOM
async function displayFiveDayForecast() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;
    var response = await $.ajax({
        url: queryURL,
        method: "GET"
        })
    var forecastDiv = $("<div  id='fiveDayForecast'>");
    var forecastHeader = $("<h4 class='card-header border-secondary'>").text("5 Day Forecast");
    forecastDiv.append(forecastHeader);
    var cardDeck = $("<div  class='card-deck'>");
    forecastDiv.append(cardDeck);
    for (i=0; i<5;i++) {
        var forecastCard = $("<div class='card'>");
        var cardBody = $("<div class='card-body'>");
        // forecast date section
        var date = new Date();
        var val=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
        var forecastDate = $("<h4 class='card-title'>").text(val);  
        cardBody.append(forecastDate);
        // forecast icon
        var getCurrentWeatherIcon = response.list[i].weather[0].icon;
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
        cardBody.append(displayWeatherIcon);
        // temperature
        var getTemp = response.list[i].main.temp;
        var tempEl = $("<p class='card-text'>").text("Temp: "+getTemp+" °F");
        cardBody.append(tempEl);
        // wind speed
        var getWind = response.list[i].wind.speed;
        var WindEl = $("<p class='card-text'>").text("Wind: "+getWind+" MPH");
        cardBody.append(WindEl);
        // humidity data
        var getHumidity = response.list[i].main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        cardBody.append(humidityEl);
        forecastCard.append(cardBody);
        cardDeck.append(forecastCard);
        }
    $("#forecastContainer").html(forecastDiv);
    }

// This function is used to pass the city in the history list to the displayWeather function
function historyDisplayWeather() {
    cityName = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(cityName);
    }

$(document).on("click", ".city", historyDisplayWeather);