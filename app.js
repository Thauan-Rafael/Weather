const express = require('express')
const app = express()
const https = require('https')

app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

app.get('/', (req,res) => {res.sendFile(__dirname + '/index.html') })
app.listen(3000, () => {console.log('App running on port 3000')})

app.post('/', function(req,res){
  
    const {latitude, longitude} = req.body;
    const appId = '7e9f5db2e73b7f2c43c3354263178440'
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+appId+'&units=metric'
    https.get(url, function(response) {
      response.on('data', function(data) {
          console.log(url);
          const weatherData = JSON.parse(data)
          const temperature = weatherData.main.temp
          const description = weatherData.weather[0].description
          const icon = weatherData.weather[0].icon
          const imgUrl = 'https://openweathermap.org/img/wn/' + icon + '.png'
          res.write('<h1>'+weatherData.name+' temperature is '+temperature+' Celsius</h1>')
          res.write('<h3>Description of time: '+description+'</h3>')
          res.write('<img src='+imgUrl+' />')
          res.send()
          console.log(url);
      })
    })
  }
)