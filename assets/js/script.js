// var date = moment().format('dddd, MMMM Do YYYY');
// var time = moment().format('HH:MM:SS');


var key = "8f86eeff2c41d4e8294b54f7d4d495b9";
var city = "Houston";


$("#searchbutton").on("click", function() {
var searchValue = $(".searchtext").val()
  console.log(searchValue);
  geoCode(searchValue);
});

function geoCode(cityValue) {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=1&appid=${key}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    weatherToday(data[0].lat, data[0].lon);
  })
};

function weatherFive() {
//  call this in GeoCode function just like weather today, use same API call as in weather today but instead of current you will be using the daily array, have to have for loop that goes through data.daily.length
};


function weatherToday(lat, lon) {
  fetch("https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly&units=imperial&appid="+key)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    var currentCard = $("<div>").addClass("card");
    var currentTemp = $("<h2>").text("temp: "+data.current.temp);
    var currentHum = $("<h2>").text("humidity: "+data.current.humidity);
    var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png");

    currentCard.append(icon, currentTemp, currentHum);
    $("#todayforecast").append(currentCard);
  })
};
  
