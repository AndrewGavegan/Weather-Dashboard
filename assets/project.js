
var userInput = document.getElementById('enterCity')
var userForm = document.getElementById('userForm')
var userList = document.getElementById('userList')
var fiveDay = document.querySelector('.fivedayforecast')
var searchHistory = [];

// submit listener to search for a city, checks if there is anything typed, won't save or search unless anything is typed. displays hidden content and runs fetch function getWeather to fill the page //
userForm.addEventListener('submit', function(event) {
    event.preventDefault()
    if (userInput.value === '' || userList.value === null) {
        return;}
    else {
        $(".rightSide").css("display", "block")
    var searchValue = userInput.value.trim();
    fiveDay.innerHTML = " "
    getWeather(searchValue);
    
// pushes your search into an empty array, ready to be created into the search history //
    searchHistory.push(searchValue);
    // resets input //
    userInput.value = "";
    
//running local storage setting //
    setCity();
    // rendering list of search history //
    renderCity();;
    }
})
 
// function for getting and creating data for the current days weather //
function getWeather(searchValue){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=232ce0ece863b7a104e0cace8f3b4568"
    fetch(apiUrl).then(function (response) {
    return response.json();
})
.then(function (data) {

    var today = moment.unix(data.dt).format("DD/MM/YYYY");
    
    $(".city").html("<h1>" + data.name + ": Weather Details: " + today + "</h1>");
    $(".wind").text("Wind Speed: " + data.wind.speed);
    $(".humidity").text("Humidity: " + data.main.humidity);
    var tempC = data.main.temp - 273.15;
    $(".tempC").text("Temperature (C): " + tempC.toFixed(2));
    var image = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var weatherImage = $("<img>").attr("src", image);
    $(".city").append(weatherImage);

// grabbing the longtitude and latitude of your location to plug into the next fetch call, to get the 5 future days weather //
            var lattitude = data.coord.lat;
            var longtitude = data.coord.lon;
        // calling new function //
            getFutureWeather(lattitude, longtitude);
});
}
// using lattitude and longtitude querys in this url for the api //
function getFutureWeather(lattitude, longtitude) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longtitude + "&appid=232ce0ece863b7a104e0cace8f3b4568";
    fetch(apiUrl).then(function (response) {
    return response.json();
})
.then(function (data) {
    // make for loop that runs from i = 1 to 6 to display tomorrow and the following four days weather, cant use 0 as that is referencing todays date in the API //
    for (let i = 1; i < 6; i++) {
        
        var date = moment.unix(data.daily[i].dt).format("DD/MM/YYYY");
        var image = "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";
        var tomorrowTemp = Math.floor(data.daily[i].temp.day - 273.15);
        var tomorrowHumidity = data.daily[i].humidity;
        var weatherImage = $("<img>").attr("src", image);
        
        var days = $("<div></div>").attr("class", "days").append("Date: \n" + date + "\n Temp (C): \n" + tomorrowTemp + "\n \n Humidity: " + tomorrowHumidity);
        days.prepend(weatherImage);
        $(".fivedayforecast").append(days);

        // if statements that change colour of div if UV index is favourable, moderate or severe //
        $(".uvIndex").text("UV Index: " + data.current.uvi);
        if (data.current.uvi < 3) {
            $(".uvIndex").css({ "background-color": "green", "color": "white" });
        }
        if (data.current.uvi >= 3 && data.current.uvi <= 5) {
            $(".uvIndex").css({ "background-color": "purple", "color": "white" });
        }
        if (data.current.uvi > 5) {
            $(".uvIndex").css({ "background-color": "red", "color": "white" });
        }
    }
});
}
// creating and running init function, just basic function that grabs local storage and calls the render function so your search history appears even if you refresh etc//
function init() {
    var storedCity = JSON.parse(localStorage.getItem("cityNames"));

    if (storedCity !== null) {
        searchHistory = storedCity;
    }
    renderCity();
}
init()
// rendering your previous searches into new li elements as search history //
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
// setting your search input into local storage //
function setCity() {
    localStorage.setItem("cityNames", JSON.stringify(searchHistory));
}

$(userList).click(function (event) {
    var element = event.target;

    // targeting button element created in list rendering, if you click it, the city in reference will be deleted //
    if (element.matches("button") === true) {
        var index = $(element.parentElement).attr("data-index");
        searchHistory.splice(index, 1);

        setCity();
        renderCity();
    }
    else {
        // making sure to clear previous html appendages so the next ones dont go after it continuously //
        fiveDay.innerHTML = " "
        $(".rightSide").css("display", "block")
        var searchValue = element.innerText;
        getWeather(searchValue);
    }

});