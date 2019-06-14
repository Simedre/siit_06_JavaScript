var appKey = "f24f40b1c24505685fce3b8acd0fcffc";

var searchButton = document.getElementById("vremea");
var searchFrocastButton = document.getElementById("prognoza");
var searchInput = document.getElementById("search-txt");
var cityName = document.getElementById("city-name");
var icon = document.getElementById("icon");
var temperature = document.getElementById("temp");
var humidity = document.getElementById("humidity-div");
var maxTemp = document.getElementById("temp-max");
var minTemp = document.getElementById("temp-min");
var mainWather = document.getElementById("city-w");
var descriptionWather = document.getElementById("city-desW");
var pressure = document.getElementById("pressure");
var wind = document.getElementById("wind");

searchButton.addEventListener("click", findWeatherDetails);
searchFrocastButton.addEventListener("click", findWeatherDetails);
searchFrocastButton.addEventListener("click", findForcastWeatherDetails);
searchInput.addEventListener("keyup", enterPressed);

function enterPressed(event) {
    if (event.key === "Enter") {
        findWeatherDetails();
    }
}

function findWeatherDetails() {
    if (searchInput.value === "") {
  
    }else {
        var searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput.value + "&appid="+appKey;
        httpRequestAsync(searchLink, theResponse);
    }
        //console.log(searchLink);
        //console.log(searchLinkForecast);
}

function findForcastWeatherDetails() {
    if (searchInput.value === "") {
  
    }else {
        var searchLinkForecast = "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=" + searchInput.value + "&appid="+appKey;
        httpRequestAsync(searchLinkForecast, theForcast);
    }
        //console.log(searchLink);
        //console.log(searchLinkForecast);
}

function theResponse(response) {
    var jsonObject = JSON.parse(response);
    cityName.innerHTML = "<p>" + jsonObject.name + "</p>";
    icon.src = "http://openweathermap.org/img/w/" + jsonObject.weather[0].icon + ".png";
    temperature.innerHTML = "<p>Temperatura curenta: " + parseInt(jsonObject.main.temp - 273) + "°C</p>";
    humidity.innerHTML = "<p>Umiditare: " + jsonObject.main.humidity + "%</p>";
    maxTemp.innerHTML = "<p>Maxima zilei: " + parseInt(jsonObject.main.temp_max - 273) + "°C</p>";
    minTemp.innerHTML = "<p>Minima zilei: " + parseInt(jsonObject.main.temp_min - 273) + "°C</P>";
    mainWather.innerHTML = "<p>Descriere: " + jsonObject.weather[0].main + "</p>";
    descriptionWather.innerHTML = jsonObject.weather[0].description;
    pressure.innerHTML = "<p>Presiune: " + jsonObject.main.pressure + " hpa</p>";
    wind.innerHTML = "<p>Vant: " + jsonObject.wind.speed + " m/s</p>";
    //console.log(jsonObject.coord);
    //console.log(jsonObject.weather[0].main);
}

function theForcast(response) {
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var table = document.getElementById("forecast");
    var tableBody="";
    var jsonObject = JSON.parse(response);
    for (var i = 0; i<jsonObject.list.length; i++){
        //var d = new Date(jsonObject.list[i].dt);
        tableBody +=`
            <tr>
                <td>
                    ${jsonObject.list[i].dt_txt.substring(0,10)}</br>
                    ${jsonObject.list[i].weather[0].main}
                </td>
                <td><img src="http://openweathermap.org/img/w/${jsonObject.list[i].weather[0].icon}.png"></td>
                <td>
                    <spam>Minima zilei : ${parseInt(jsonObject.list[i].main.temp_max) + "°C"}</spam></br>
                    <spam>Maxima zilei : ${parseInt(jsonObject.list[i].main.temp_min) + "°C"}</spam>
                </td>
                <td>
                    <spam>Pressure:</br>${parseInt(jsonObject.list[i].main.pressure) + " hpa"}</spam>
                </td>
                <td>
                    <spam>Wind speed:</br>${parseInt(jsonObject.list[i].wind.speed) + " m/s"}</spam>
                </td>
                <td>
                    <spam>Clouds:</br>${jsonObject.list[i].clouds.all + "%"}</spam>
                </td>
            </tr>
        `;
        //console.log(jsonObject.list[i].dt);
    }

    table.innerHTML = tableBody;
    //console.log(Date(jsonObject.list[0].dt).toString().substring(0,10));
    //console.log(Date(jsonObject.list[0].dt).getFullYear());
    //console.log(jsonObject.list);
}

function httpRequestAsync(url, callback){
    //console.log("hello");
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => { 
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }
    httpRequest.open("GET", url, true); // true for asynchronous 
    httpRequest.send();
}