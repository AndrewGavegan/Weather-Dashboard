
var userInput = document.getElementById('enterCity')
var userForm = document.getElementById('userForm')
var userList = document.getElementById('userList')
var cityName = "Sydney"
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=232ce0ece863b7a104e0cace8f3b4568"

var searchHistory = [];

userForm.addEventListener('submit', function(event) {
    event.preventDefault()
    console.log("submit works!")

    var searchValue = userInput.value.trim();

    console.log(searchValue);
})

fetch(apiUrl).then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);
})