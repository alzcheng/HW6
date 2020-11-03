var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=atlanta&appid=d3704233aa04b4a5db706d0f4fce1f31"

var city;

fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        city = data;
        console.log(data);
    });

    