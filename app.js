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
  
    const {latitude, longitude} = req.body;
    const appId = '7e9f5db2e73b7f2c43c3354263178440';
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+appId+'&units=metric';
    https.get(url, function(response) {
      response.on('data', function(data) {
          const weatherData = JSON.parse(data);
          const icon = weatherData.weather[0].icon;
          let weatherInfo = {
            name: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
          }
          res.render('weather',{weatherInfo})
      })
    })
  }
)