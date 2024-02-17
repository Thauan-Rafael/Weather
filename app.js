const express = require('express');
const app = express();
const https = require('https');

app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get('/', (req,res) => {
  let weatherInfo = false
  res.render('weather',{weatherInfo})
});
app.listen(3000, () => {console.log('App running on port 3000')});

app.post('/', function(req,res){
  
    var {latitude, longitude} = req.body;
    const dmsPattern = /^-?\d+°\s*\d+'?\s*\d+"?$/;
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
    console.log(latitude, longitude)
    const appId = '7e9f5db2e73b7f2c43c3354263178440';
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
          res.render('weather',{weatherInfo})
      })
    })
  }
)