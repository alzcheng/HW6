var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=atlanta&appid=d3704233aa04b4a5db706d0f4fce1f31"

var searchBtn = $(".searchBtn");
searchBtn.on("click", showCityWeather);

function showCityWeather(e) {
    e.preventDefault();
    var cityName = $("#searchCity").val();
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=d3704233aa04b4a5db706d0f4fce1f31";

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (city) {
            var cityTemperature = Number.parseFloat(city.main.temp).toFixed(1);
            var longitude = city.coord.lon;
            var latitude = city.coord.lat;
            console.log(city)
            $(".cityTitleName").text(city.name);
            $(".cityTemp").text("Temperature: " + cityTemperature.toString() + " " + String.fromCharCode(176) + "F");
            $(".cityHumidity").text("Humidity: " + city.main.humidity + "%");
            $(".cityWindSpeed").text("Wind Speed: " + city.wind.speed + " MPH");
            showUVIndex(latitude, longitude)
            showCityForecast(cityName);
        });

}

function showUVIndex(lat, lon) {
    var requestURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=d3704233aa04b4a5db706d0f4fce1f31"

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });

}

function showCityForecast(cityName) {
    var requestURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=3&units=imperial&appid=d3704233aa04b4a5db706d0f4fce1f31"
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}





