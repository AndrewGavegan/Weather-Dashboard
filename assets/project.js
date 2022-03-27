
var userInput = document.getElementById('enterCity')
var userForm = document.getElementById('userForm')
var userList = document.getElementById('userList')

var searchHistory = [];

userForm.addEventListener('submit', function(event) {
    event.preventDefault()
    console.log("submit works!")
})