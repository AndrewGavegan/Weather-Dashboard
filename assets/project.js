
var userInput = document.getElementById('enterCity')
var userForm = document.getElementById('userForm')
var userList = document.getElementById('userList')

var searchHistory = [];

userForm.addEventListener('submit', function(event) {
    event.preventDefault()

    var searchValue = userInput.value.trim();
    
    getWeather(searchValue);

    searchHistory.push(searchValue);
    userInput.value = "";

    setCity();
    renderCity();

})

function getWeather(searchValue){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=232ce0ece863b7a104e0cace8f3b4568"
    fetch(apiUrl).then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);

    var today = moment.unix(data.dt).format("DD/MM/YYYY");
    console.log(today)

    $(".city").html("<h1>" + data.name + ": Weather Details: " + today + "</h1>");
    $(".wind").text("Wind Speed: " + data.wind.speed);
    $(".humidity").text("Humidity: " + data.main.humidity);
    var tempC = data.main.temp - 273.15;
    $(".tempC").text("Temperature (C) " + tempC.toFixed(2));

            var lattitude = data.coord.lat;
            var longtitude = data.coord.lon;

            console.log(lattitude);
            console.log(longtitude);

            getFutureWeather(lattitude, longtitude);
});
}

function getFutureWeather(lattitude, longtitude) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longtitude + "&appid=232ce0ece863b7a104e0cace8f3b4568";
    fetch(apiUrl).then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data)

        var date = moment.unix(data.daily[0].dt).format("DD/MM/YYYY");
        var icon = data.daily[0].weather[0].icon;
        var image = "http://openweathermap.org/img/w/" + icon + ".png";
        var tomorrowTemp = data.daily[0].temp.day;
        var tomorrowHumidity = data.daily[0].humidity;

        $(".day1").html("Date: " + date + " & " + "Temp:" + tomorrowTemp + " & " + "Humidity:" + tomorrowHumidity);

            var weatherImage = $("<img>").attr("src", image);
            $(".day1").append(weatherImage);
});
}











// below this is done //
init()

function init() {
    var storedCity = JSON.parse(localStorage.getItem("cityNames"));

    if (storedCity !== null) {
        searchHistory = storedCity;
    }
    renderCity();
}

function renderCity() {
    $(userList).html("");

    for (var i = 0; i < searchHistory.length; i++) {
        var cityname = searchHistory[i];

        var li = document.createElement("p");
        $(li).html("<span>" + cityname + "</span>");
        $(li).attr("data-index", i);

        var button = document.createElement("button");
        $(button).text("delete");

        $(li).append(button);
        $(userList).append(li);
    }
}

function setCity() {
    localStorage.setItem("cityNames", JSON.stringify(searchHistory));
}

$(userList).click(function (event) {
    var element = event.target;

    if (element.matches("button") === true) {
        var index = $(element.parentElement).attr("data-index");
        searchHistory.splice(index, 1);

        setCity();
        renderCity();
    }
    else {
        var searchValue = element.innerText;
        getWeather(searchValue);
    }

});