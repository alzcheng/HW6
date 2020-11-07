//Initialize global variables
var cityHistory = [{ city: "" }];
var historyCount = 0;
var firstClick = true;

//Store initial empty history in local storage
localStorage.setItem("searchHistory", JSON.stringify(cityHistory));

//Define functions

//showDate takes in a Unix time stamp and returns the date in the format of MM/DD/YYYY
function showDate(dt) {
    var myDate = new Date(dt * 1000);
    var date = myDate.getDate();
    var month = myDate.getMonth() + 1;
    var year = myDate.getFullYear();
    return String(month) + "/" + String(date) + "/" + String(year);
}

//initializeCards() dynamically create the DOM element templates for the first time that 
//a search is made.  It creates the main card, search history groups, and forecast cards.
function initializeCards() {
    $(".mainCardCol").append('<div class="card main-card"><div class="card-body main-body-card"><ul><h4 class="card-title cityTitleName"></h4><img class="titleIcon" src="" alt="icon not found"><p class="card-text cityTemp"></p><p class="card-text cityHumidity"></p><p class="card-text cityWindSpeed"></p><p class="card-text cityUVIndex"></p></ul></div></div>');
    $(".searchListGroup").append('<div class="card search-history"><ul class="list-group list-group-flush searchList"></ul></div>');
    $(".forecastTitle").append('<h3>5-Day Forecast: </h3>')
    for (i = 0; i < 5; i++) {
        $(".forecastCards").append('<div class="card forecastCard"><div class="card-body"><h5 class="card-title forecastDate"></h5><img class="forecastIcon" src="" alt=""><p class="card-text forecastTemp"></p><p class="card-text forecastHumidity"></p></div></div>');
    }
    firstClick = false;
}

//addCityHistory takes in a city name string and stores it into local storage as a cityHistory
//object.  It will also display the city name in the top of the search history cards.
function addCityHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    var historyDisplay = $(".searchItems");
    var searchedCity = { city: cityName };

    //If there hasn't been 8 searches yet, create cards and add the search term on there, 
    //otherwise, add the search term at the top of the stack
    if (searchHistory[0].city === "") {
        searchHistory[0].city = cityName;
        $(".searchList").append('<li class="list-group-item searchItems">' + cityName + '</li>')
        historyCount++;
    } else {
        if (historyCount < 8) {
            searchHistory.unshift(searchedCity);
            $(".searchList").prepend('<li class="list-group-item searchItems">' + cityName + '</li>')
            historyCount++;
        } else {
            searchHistory.unshift(searchedCity);
            searchHistory.pop();
            for (i = 0; i < searchHistory.length; i++) {
                $(historyDisplay[i]).text(searchHistory[i].city);
            };
        }
    }

    //Update local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

//showCityForecast takes in the latitude and longitude of a city and sets the information for 
//5 days of forecast with the date, the weather status icon, the temperature, and the humidity
//for that latitude and longitude. 
function showCityForecast(lat, lon) {
    //Calling the One Call api from the OpenWeather
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=d3704233aa04b4a5db706d0f4fce1f31"
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (cityWeather) {
            var cityCurrentUVI = Number.parseFloat(cityWeather.current.uvi);
            var forecastDates = $(".forecastDate");
            var forecastIcons = $(".forecastIcon");
            var forecastTemps = $(".forecastTemp");
            var forecastHumidities = $(".forecastHumidity");

            //Change the background color of the UV Index to favorable(green), moderate(orange), and severe(red)
            if (cityCurrentUVI <= 3) {
                $(".cityUVIndex").html('UV Index: <span class="UV-favorable">' + cityCurrentUVI + '</span>');
            } else if (cityCurrentUVI <= 7) {
                $(".cityUVIndex").html('UV Index: <span class="UV-moderate">' + cityCurrentUVI + '</span>');
            } else {
                $(".cityUVIndex").html('UV Index: <span class="UV-severe">' + cityCurrentUVI + '</span>');
            }

            //Update the information for the different forecast cards
            for (i = 0; i < forecastDates.length; i++) {
                $(forecastDates[i]).text(showDate(cityWeather.daily[i + 1].dt));
                $(forecastIcons[i]).attr("src", "http://openweathermap.org/img/wn/" + cityWeather.daily[i + 1].weather[0].icon + "@2x.png");
                $(forecastTemps[i]).text("Temp: " + String(Number.parseFloat((cityWeather.daily[i + 1].temp.max + cityWeather.daily[i + 1].temp.min) / 2).toFixed(1)) + " " + String.fromCharCode(176) + "F");
                $(forecastHumidities[i]).text("Humidity: " + cityWeather.daily[i + 1].humidity + "%");
            }
        });
}


//showCityWeather takes in city name as a string and it sets the main card with all the information
//from the OpenWeather api and set the information in the main card and the forecast cards
function showCityWeather(cityName) {
    //Calling Current Weather Data api from OpenWeather
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=d3704233aa04b4a5db706d0f4fce1f31";
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (city) {
            var cityTemperature = Number.parseFloat(city.main.temp).toFixed(1);
            var longitude = city.coord.lon;
            var latitude = city.coord.lat;
            //Convert the Unix date to the MM/DD/YYYY formate 
            var currentDate = showDate(city.dt)

            //If this is the first time search is clicked, set the website elements 
            if (firstClick) {
                initializeCards();
            }

            //Set the information on the main card for the searched city 
            $(".cityTitleName").text(city.name + " (" + currentDate + ")");
            $(".cityTemp").text("Temperature: " + cityTemperature.toString() + " " + String.fromCharCode(176) + "F");
            $(".cityHumidity").text("Humidity: " + city.main.humidity + "%");
            $(".cityWindSpeed").text("Wind Speed: " + city.wind.speed + " MPH");
            $(".titleIcon").attr("src", "http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png")

            //Set the information for the 5 day forecast cards
            showCityForecast(latitude, longitude);
            //Add the city name into the search history
            addCityHistory(cityName);
            //Clears the search for the next search
            $("#searchCity").val('');
        }).catch(function (error) {
            //if not a valid city, give an alert and clear search
            alert("Not a valid city");
            $("#searchCity").val('');
        });
}

//When clicking the search button, use the city name in the search to generate result
$(".searchBtn").on("click", function (e) {
    e.preventDefault();
    var cityName = $("#searchCity").val();
    showCityWeather(cityName);
});

//When clicking the search history, use the search history as a result
$(".searchList").on("click", ".searchItems", function (e) {
    e.preventDefault();
    var cityName = $(this).text();
    showCityWeather(cityName);
});