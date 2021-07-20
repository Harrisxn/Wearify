// importing modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
var connect = require('connect');
const { json } = require('body-parser');
const fetch = require('node-fetch');
const randomInt = require('random-int');

// defining directory 
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

// api key for weather
const apiKey = '';

//defining functions 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

// defining variables 
let strLat = "";
let strLong = "";

// defining clothing responses
let strResponse2 = 'You should wear: Long pants, coat/jumper'
let strResponse3 = 'You should wear: Short pants, shirt/light coat'


// rendering main page
app.get('/', function (req, res) {
  res.render('index', {accessories: null, intRandom: null, strWeatherTemp: null, strWeather: null, strLocation: null, strClothing: null, strError: null});
})

// rendering permissions disabled page (if location permissions disabled)
app.get('/disabled_permissions', function (req, res)
{
    res.render('disabled');
});

// gathering user co-ordinates and sending them to frontend
app.post('/', (req, res) => {
  
  // defining longitude / latitude variables
  strLat = req.body.lat;
  strLong = req.body.long;

  // defining api 
  let strMain = `http://api.openweathermap.org/data/2.5/weather?lat=${strLat}&lon=${strLong}&units=metric&appid=${apiKey}`
  let strSettings = { method: "Get" };

// parsing json (using longitude/lat)
fetch(strMain, strSettings)
    .then(res => res.json())
    .then((json) => {

      // defining varaiables   
      let strTemp = json.main.temp + '°'
      let strLocation = json.name
      let strDesc = json.weather[0].description
      let strIcon = json.weather[0].icon
      let strIconURL = `http://openweathermap.org/img/wn/${strIcon}@2x.png`
      let intRandom = randomInt(1, 5); 

      // defining if statements (if temp greater then 15 then render appropriate charater models // information)
    if (json.main.temp < 15 ){
      res.render('weather', {accessories: json.weather[0].main, intRandom: intRandom, icon: strIconURL, weathertemp: json.main.temp, weather: strTemp, location: strLocation, description: strDesc, clothing: strResponse2, error:null});
    } else {
    if (json.main.temp > 15){
      res.render('weather', {accessories: json.weather[0].main, intRandom: intRandom, icon: strIconURL, weathertemp: json.main.temp, weather: strTemp, location: strLocation, description: strDesc, clothing: strResponse3, error:null});
    }
    }
    
  });
})

// defining search page
app.post('/search', function (req, res) {
  
  // defining varaiables for web page
  let strCity = req.body.city;
  let strResponse1 = 'hello'
  let strResponse2 = 'You should wear: Long pants, coat/jumper'
  let strResponse3 = 'You should wear: Short pants, shirt/light coat'
  let strSearchURL = `http://api.openweathermap.org/data/2.5/weather?q=${strCity}&units=metric&appid=${apiKey}`
  let strIcon = " "
  
  // html page render
  request(strSearchURL, function (err, response, body) {
    // parsing json api data 
    let strWeather = JSON.parse(body)
    // error handling 
    if(strWeather.cod == "400"){
      res.render('search', {accessories: null, intRandom: null, icon: null, weathertemp: null, weather: null, location: null, description: null, clothing: null, error: 'Search box blank, please try again'});
    } else {
      if(strWeather.cod == "404"){
        res.render('search', {accessories: null, intRandom: null, icon: null, weathertemp: null, weather: null, location: null, description: null, clothing: null, error: 'Invalid location, please try again'});
      } 
      else { 
        // setting a random int to display random character models on frontend
        intRandom = randomInt(1, 5);  
        // setting additional variables
        strIcon = strWeather.weather[0].icon
        let strDesc = strWeather.weather[0].description
        let strIconURL = `http://openweathermap.org/img/wn/${strIcon}@2x.png`;
        // if weather less than 15 degrees then render....
        if (strWeather.main.temp < 15) {
        let strResponse = `${strWeather.main.temp}°`;
        res.render('search', {accessories: strWeather.weather[0].main, intRandom: intRandom, icon: strIconURL, weathertemp: strWeather.main.temp, location: strWeather.name, description: strDesc, weather: strResponse, clothing: strResponse2,  error: null});
        // if weather greater than 15 degrees then render...
      } else {
        if (strWeather.main.temp > 15) {
        let strResponse = `${strWeather.main.temp}°`;
  
        res.render('search', {accessories: strWeather.weather[0].main, intRandom: intRandom, icon: strIconURL, weathertemp: strWeather.main.temp, location: strWeather.name, description: strDesc, weather: strResponse, clothing: strResponse3,  error: null});
        // else render this..
      } else{
        let weatherText = `${strWeather.main.temp}°`;
        res.render('search', {accessories: strWeather.weather[0].main, intRandom: intRandom, icon: strIconURL, weathertemp: strWeather.main.temp, location: strWeather.name, description: strDesc, weather: weatherText, clothing: strResponse1, error: null});
      }
    }
      }
    }
  });
})



// launching app on port whatever is set by heroku & 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('App Launched!')
})

// invalid page redirection
app.use(function (req, res) {
  res.status(404).render('error');
});