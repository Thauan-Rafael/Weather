const express = require('express');
const app = express();
const https = require('https');
require('dotenv').config();

app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

let weatherInfo = false;
let dataFound = 'Not searched yet';
app.get('/', (req,res) => {
  dataFound = 'Not searched yet'
  res.render('weather',{weatherInfo, dataFound})
});
app.listen(3000, () => {console.log('App running on port 3000')});

app.post('/', function(req,res){  
    const decimalPattern = /^-?\d+(\.\d+)?$/
    const dmsPattern = /^-?\d+°\s*\d+'?\s*\d+"?$/;
    var {latitude, longitude} = req.body;
    latitude = latitude.replace(',','.');
    longitude = longitude.replace(',','.')
    if(decimalPattern.test(latitude) == false && dmsPattern.test(latitude) == false || decimalPattern.test(longitude) == false && dmsPattern.test(longitude) == false){
      dataFound = 'Invalid values';
      res.render('weather',{weatherInfo, dataFound});      
    }
    else{
      if (dmsPattern.test(latitude)) {
        const dmsLat = latitude.split(/[°'\"]/).filter(Boolean);
        if(parseFloat(dmsLat[0]) > 0){
        latitude = parseFloat(dmsLat[0]) + (parseFloat(dmsLat[1])/60) + (parseFloat(dmsLat[2])/3600)
        }
        if(parseFloat(dmsLat[0]) < 0){
        latitude = (parseFloat(dmsLat[0] * -1) + (parseFloat(dmsLat[1])/60) + (parseFloat(dmsLat[2])/3600))*-1
        }
      }
      if (dmsPattern.test(longitude)) {
        const dmsLon = longitude.split(/[°'\"]/).filter(Boolean);
        if(parseFloat(dmsLon[0]) > 0){
          longitude = parseFloat(dmsLon[0]) + (parseFloat(dmsLon[1])/60) + (parseFloat(dmsLon[2])/3600)
        }
        if(parseFloat(dmsLon[0]) < 0){
          longitude = (parseFloat(dmsLon[0] * -1) + (parseFloat(dmsLon[1])/60) + (parseFloat(dmsLon[2])/3600))*-1
        }
      }
      const appId = process.env.key;
      console.log(appId);
      const url = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+appId+'&units=metric';
      https.get(url, function(response) {
        response.on('data', function(data) {
            const weatherData = JSON.parse(data);
            let weatherInfo = {
              name: weatherData.name,
              country: weatherData.sys.country,
              tempC: weatherData.main.temp,
              tempF: (weatherData.main.temp * 1.8 + 32).toFixed(2),
              tempK: (weatherData.main.temp + 273.15).toFixed(2),
              description: weatherData.weather[0].description,
              icon: weatherData.weather[0].icon,
              humidity: weatherData.main.humidity,
              windSpeed: weatherData.wind.speed,
            }
            dataFound = 'Success'
            res.render('weather',{weatherInfo, dataFound})
        })
      })
   }
  }
)