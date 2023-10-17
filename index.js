

let yourWeather = document.getElementById('yourWeather');
let searchWeather = document.getElementById('searchWeather');
let locationContainer = document.querySelector('.location');
let loadingContainer = document.querySelector('.loading-container');
let grantAccess = document.getElementById('grantAccess');
let formContainer = document.querySelector('.form-container');
let searchInput = document.getElementById('searchInput');
let searchLogo = document.querySelector('.search-logo');
let weatherResult = document.querySelector('.weather-result');
let cityName = document.getElementById('cityName');
let flag = document.querySelector('.flag');
let cityCondition = document.getElementById('cityCondition');
let cityConditionImg = document.getElementById('cityConditionImg');
let temp = document.getElementById('temp');
let windspeedHeading = document.getElementById('windspeed-heading');
let windData = document.getElementById('windData');
let humidityHeading = document.getElementById('humidity-heading');
let humidityData = document.getElementById('humidityData');
let cloudsHeading = document.getElementById('cloud-heading');
let cloudData = document.getElementById('cloudData');
let notFound = document.querySelector('.not-found');
let oldTab = yourWeather;
oldTab.classList.add('active');
let apiKey = "eb9f6401031bae21a7a8a4cc75679ec0";


function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove('active');
        oldTab = newTab;
        oldTab .classList.add('active');

        if(formContainer.classList.contains('vanish')){
            formContainer.classList.remove('vanish');
            locationContainer.classList.add('vanish');
            weatherResult.classList.add('vanish');


        }
        else{
            formContainer.classList.add('vanish');
            // locationContainer.classList.remove('vanish');
            notFound.classList.add('vanish');
            weatherResult.classList.add('vanish');
            getFromSessionStorage();
        }
    }
}

// yourWeather.addEventListener('click', ()=>{
//     searchWeather.classList.remove('active');
//     yourWeather.classList.add('active');
//     formContainer.classList.add('vanish');
//     locationContainer.classList.remove('vanish');
//     weatherResult.classList.add('vanish');
//     if(locationPermissions){
//         locationContainer.classList.add('vanish');
//     }
//     getFromSessionStorage();
// });

yourWeather.addEventListener('click', ()=>{
    switchTab(yourWeather);
});

// searchWeather.addEventListener('click', ()=>{
//     yourWeather.classList.remove('active');
//     locationContainer.classList.add('vanish');
//     searchWeather.classList.add('active');
//     formContainer.classList.remove('vanish');
//     weatherResult.classList.add('vanish');
// });

searchWeather.addEventListener('click', ()=>{
    switchTab(searchWeather);
});

searchLogo.addEventListener('click', ()=>{
    let inputValue = searchInput.value;
    showWeatherByCity(inputValue);
    searchInput.value = "";
});

formContainer.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(searchInput.value == ""){
        return;
    }
    let inputValue = searchInput.value;
    showWeatherByCity(inputValue);
    searchInput.value = "";
});


function putFetchedDataIntoWeatherResultContainer(data){
    cityName.innerText = data?.name;
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    cityCondition.innerText = data?.weather?.[0]?.main;
    cityConditionImg.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp.toFixed(2)}°C/°F`;
    windData.innerText = `${data?.wind?.speed.toFixed(2)}m/s`;
    humidityData.innerText = `${data?.main?.humidity}%`;
    cloudData.innerText = `${data?.clouds?.all}%`;
}

function getCurrentLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosiiton);
    }
    else{
        window.alert("Your browser does not support geolocation");
    }
}

function showPosiiton(params){
    const sessionLocation = {
        lati : params.coords.latitude,
        longi : params.coords.longitude
    }
    sessionStorage.setItem("user-location", JSON.stringify(sessionLocation));
    showWeatherByCoordinates(sessionLocation);
}

function setLocation(params){
    window.sessionStorage.setItem("user-location", JSON.stringify(params));
}

function getFromSessionStorage(){
    const sessionCoordinates = window.sessionStorage.getItem("user-location");
    if(sessionCoordinates){
        // if sessionCoordinates is present in the sesssion storage
        locationContainer.classList.add('vanish');
        const coordinates = JSON.parse(sessionCoordinates);
        showWeatherByCoordinates(coordinates);
    }
    else{
        locationContainer.classList.remove('vanish');
    }
}

getFromSessionStorage();
grantAccess.addEventListener('click', ()=>{
    locationContainer.classList.add('vanish');
    loadingContainer.classList.remove('vanish');
    getCurrentLocation();
});

function showError(error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
    case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
    case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
    case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
}


async function showWeatherByCoordinates(coordinates){
    locationContainer.classList.add('vanish');
    loadingContainer.classList.remove('vanish'); 
    const latitude = coordinates.lati;
    const longitude = coordinates.longi;
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);

        const data = await response.json();
        if (!data.sys){
            throw data;
        }
        loadingContainer.classList.add('vanish');
        putFetchedDataIntoWeatherResultContainer(data);
        weatherResult.classList.remove('vanish');
        // console.log(data);
    } catch (error) {
        // console.log('Some Error occurred '+ error);
        window.alert("Some Error occurred");
        
    }
};

async function showWeatherByCity(city){
    loadingContainer.classList.remove('vanish'); 
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingContainer.classList.add('vanish');
        putFetchedDataIntoWeatherResultContainer(data);
        weatherResult.classList.remove('vanish');
        console.log(city);
    } catch (error) {
        // console.log('Some Error occurred '+ error)
        // window.alert('Something Error occurred');
        loadingContainer.classList.add('vanish');
        weatherResult.classList.add('vanish');
        notFound.classList.remove('vanish');
    }
}
