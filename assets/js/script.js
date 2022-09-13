var date = moment().format('dddd, MM/DD/YYYY');
var time = moment().format('HH:MM:SS');


var key = "8f86eeff2c41d4e8294b54f7d4d495b9";
var city = $(".searchtext").val();
var lsArray = JSON.parse(localStorage.getItem("searchhistory")) || [null];

// functions to be called for clicking the search button
$("#searchbutton").on("click", function() {
var searchValue = $(".searchtext").val();
  console.log(searchValue);
  geoCode(searchValue);
});

// geocode function that is fetching data based on city value, also storing in local storage as an array and calling history button function
function geoCode(cityValue) {
  $("#fivedayforecast").empty();
  $("#todayforecast").empty();
  if(cityValue === null) {
    historyButton(cityValue).addClass("gone");
  }
  if(lsArray.indexOf(cityValue) === -1) {
    historyButton(cityValue);
    lsArray.push(cityValue);
  };
  localStorage.setItem("searchhistory", JSON.stringify(lsArray));
  $("#todayforecast").append(cityValue).addClass("cityname");
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=1&appid=${key}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    weatherToday(data[0].lat, data[0].lon);
    weatherFive(data[0].lat, data[0].lon);
  })
};

// history button function that is adding a button for every city that you input
function historyButton(cityValue) {
  var cityButton = $("<button>").text(cityValue).addClass("btnstyle");
  $("#searchhistory").append(cityButton);
  if(cityValue === null) {
    cityButton.addClass("gone");
  }
};

$("#searchhistory").on("click", "button", function() {
  geoCode($(this).text());
});

// dynamically adding cards for a daily forecast for the next days to come
function weatherFive(lat, lon) {
  fetch("https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly&units=imperial&appid="+key)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    for(var i = 0; data.daily.length; i++) {
    var dailyCard = $("<div>").addClass("card5");
    var dateCity = $("<h3>").text();
    var dailyTemp = $("<h3>").text("Temp: "+data.daily[i].temp.day);
    var dailyHum = $("<h3>").text("Humidity: "+data.daily[i].humidity);
    var dailyWind = $("<h3>").text("Wind: "+data.daily[i].wind_speed);

    var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/"+data.daily[i].weather[0].icon+".png");

    dailyCard.append(dateCity, icon, dailyTemp, dailyHum, dailyWind);
    $("#fivedayforecast").append(dailyCard);
    }
    
  })

};

// adding a card to provide the weather forecast for that current day, also if statement that changes uv coloring based on value
function weatherToday(lat, lon) {
  fetch("https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly&units=imperial&appid="+key)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    var currentCard = $("<div>").addClass("card");
    var currentCity = $("<h2>").val();
    var currentDate = $("<h2>").text(date);
    var currentTemp = $("<p>").text("Temp: "+data.current.temp);
    var currentHum = $("<p>").text("Humidity: "+data.current.humidity);
    var currentWind = $("<p>").text("Wind: "+data.current.wind_speed);
    var currentUv = $("<p>").text("UV: "+data.current.uvi)
      if(data.current.uvi >= 0 && data.current.uvi <= 5) {
        currentUv.attr("class", "good");
      } else {
        currentUv.attr("class", "bad");
      };


    currentCard.append(currentCity, currentDate, currentTemp, currentHum, currentWind, currentUv);
    $("#todayforecast").append(currentCard);

    
  })
};


for (var i = 0; i < lsArray.length; i++) {
  historyButton(lsArray[i]);
};

geoCode(lsArray[lsArray.length-1]);