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
            var currentDate = showDate(city.dt)
            console.log(currentDate);
            // console.log(date);
            // console.log(month);
            // console.log(year);
            console.log(longitude);
            console.log(latitude);
            console.log(city.weather[0].icon)
            $(".cityTitleName").text(city.name + " (" + currentDate + ")");
            $(".cityTemp").text("Temperature: " + cityTemperature.toString() + " " + String.fromCharCode(176) + "F");
            $(".cityHumidity").text("Humidity: " + city.main.humidity + "%");
            $(".cityWindSpeed").text("Wind Speed: " + city.wind.speed + " MPH");
            $(".titleIcon").attr("src", "http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png")
            // showUVIndex(latitude, longitude)
            showCityForecast(latitude, longitude);
        });

}

function showDate(dt) {
    var myDate = new Date(Date(dt));
    var date = myDate.getDate();
    var month = myDate.getMonth() + 1;
    var year = myDate.getFullYear();
    return String(month) + "/" + String(date) + "/" + String(year);
}

// function showUVIndex(lat, lon) {
//     var requestURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=d3704233aa04b4a5db706d0f4fce1f31"

//     fetch(requestURL)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             console.log(data);
//         });

// }

function showCityForecast(lat, lon) {
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=d3704233aa04b4a5db706d0f4fce1f31"
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}





