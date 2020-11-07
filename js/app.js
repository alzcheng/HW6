var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=atlanta&appid=d3704233aa04b4a5db706d0f4fce1f31"
var cityHistory = [{ city: "" }];
var historyCount = 0;
var firstClick = true;
localStorage.setItem("searchHistory", JSON.stringify(cityHistory));

$(".searchBtn").on("click", function (e) {
    e.preventDefault();
    var cityName = $("#searchCity").val();
    showCityWeather(cityName);
});


$(".searchList").on("click", ".searchItems", function (e) {
    e.preventDefault();
    var cityName = $(this).text();
    showCityWeather(cityName);
});

function initializeCards() {
    $(".mainCardCol").append('<div class="card main-card"><div class="card-body main-body-card"><ul><h4 class="card-title cityTitleName"></h4><img class="titleIcon" src="" alt="icon not found"><p class="card-text cityTemp"></p><p class="card-text cityHumidity"></p><p class="card-text cityWindSpeed"></p><p class="card-text cityUVIndex"></p></ul></div></div>');
    $(".searchListGroup").append('<div class="card search-history"><ul class="list-group list-group-flush searchList"></ul></div>');
    $(".forecastTitle").append('<h3>5-Day Forecast: </h3>')
    for (i = 0; i < 5; i++) {
        $(".forecastCards").append('<div class="card forecastCard"><div class="card-body"><h5 class="card-title forecastDate"></h5><img class="forecastIcon" src="" alt=""><p class="card-text forecastTemp"></p><p class="card-text forecastHumidity"></p></div></div>');
    }
    firstClick = false;
}

function addCityHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    var historyDisplay = $(".searchItems");
    var searchedCity = { city: cityName };

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
        }
    }

    if (historyCount === 8) {
        for (i = 0; i < searchHistory.length; i++) {
            $(historyDisplay[i]).text(searchHistory[i].city);
        };
    }


    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

}

function showCityWeather(cityName) {
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=d3704233aa04b4a5db706d0f4fce1f31";

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (city) {
            var cityTemperature = Number.parseFloat(city.main.temp).toFixed(1);
            var longitude = city.coord.lon;
            var latitude = city.coord.lat;
            var currentDate = showDate(city.dt)
            if (firstClick) {
                initializeCards();
            }
            $(".cityTitleName").text(city.name + " (" + currentDate + ")");
            $(".cityTemp").text("Temperature: " + cityTemperature.toString() + " " + String.fromCharCode(176) + "F");
            $(".cityHumidity").text("Humidity: " + city.main.humidity + "%");
            $(".cityWindSpeed").text("Wind Speed: " + city.wind.speed + " MPH");
            $(".titleIcon").attr("src", "http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png")
            addCityHistory(cityName);
            showCityForecast(latitude, longitude);
        }).catch(function (error) {
            alert("Not a valid city");
            $("#searchCity").val('');
        });

}

function showDate(dt) {
    var myDate = new Date(dt * 1000);
    var date = myDate.getDate();
    var month = myDate.getMonth() + 1;
    var year = myDate.getFullYear();
    return String(month) + "/" + String(date) + "/" + String(year);
}

function showCityForecast(lat, lon) {
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

            if (cityCurrentUVI <= 3) {
                $(".cityUVIndex").html('UV Index: <span class="UV-favorable">' + cityCurrentUVI + '</span>');
            } else if (cityCurrentUVI <= 7) {
                $(".cityUVIndex").html('UV Index: <span class="UV-moderate">' + cityCurrentUVI + '</span>');
            } else {
                $(".cityUVIndex").html('UV Index: <span class="UV-severe">' + cityCurrentUVI + '</span>');
            }

            for (i = 0; i < forecastDates.length; i++) {
                $(forecastDates[i]).text(showDate(cityWeather.daily[i + 1].dt));
                $(forecastIcons[i]).attr("src", "http://openweathermap.org/img/wn/" + cityWeather.daily[i + 1].weather[0].icon + "@2x.png");
                $(forecastTemps[i]).text("Temp: " + String(Number.parseFloat((cityWeather.daily[i + 1].temp.max + cityWeather.daily[i + 1].temp.min) / 2).toFixed(1)) + " " + String.fromCharCode(176) + "F");
                $(forecastHumidities[i]).text("Humidity: " + cityWeather.daily[i + 1].humidity + "%");
            }
        });
}