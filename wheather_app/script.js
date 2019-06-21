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
searchButton.addEventListener("click", showMap);
searchFrocastButton.addEventListener("click", findWeatherDetails);
searchFrocastButton.addEventListener("click", showMap);
searchFrocastButton.addEventListener("click", findForcastWeatherDetails);
searchInput.addEventListener("keyup", enterPressed);

function showMap(){
    var map = document.getElementById("map");
    map.innerHTML = `
    <div style="width: 100%"><iframe width="100%" height="300px" src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=${searchInput.value}+(Wheather%20App)&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"><a href="https://www.maps.ie/map-my-route/">Create a route on google maps</a></iframe></div><br />
                    `;
    map.className = "show";
    console.log(map);
}

function enterPressed(event) {
    if (event.key === "Enter") {
        findWeatherDetails();
        showMap();
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
    var table = document.getElementById("forecast");
    var tableBody="";
    var jsonObject = JSON.parse(response);
    for (var i = 0; i<jsonObject.list.length; i++){
        var d = new Date(jsonObject.list[i].dt*1000);
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        tableBody +=`
            <tr>
                <td>
                    ${day+" / "+month+" / "+year}</br>
                    ${hour+":"+minute+"0"}</br>
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
        //console.log(day+"/"+month+"/"+year+"-"+hour+":"+minute+"0");
        //console.log(jsonObject.list[i+1].dt);
        //console.log(d);
    }
    table.innerHTML = tableBody;
    //console.log(Date(jsonObject.list[0].dt).toString().substring(0,10));
    //console.log(Date(jsonObject.list[0].dt).getFullYear());
    //console.log(jsonObject.list);
}

function httpRequestAsync(url, callback){
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => { 
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}
