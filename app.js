const userTab = document.querySelector("[user-weather]")
const searchTab = document.querySelector("[search-weather]")

const weatherContainer = document.querySelector(".weather-container") ;

const grantLocationContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[search-form]");

const loadingContainer = document.querySelector(".loading-container");

const weatherInfoContainer = document.querySelector(".weather-info-container") ;

const btn = document.querySelector(".btn-search")

let currTab = userTab ;
let API_KEY = "d031337a6c1bb663a4fdfdc642f45d05" ;
currTab.classList.add("current-tab") ;

const switchTab = (tab) => {
    if(tab !== currTab){
        currTab.classList.remove("current-tab");
        currTab = tab ;
        currTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            grantLocationContainer.classList.remove("active");
            weatherContainer.classList.remove("active");
            searchForm.classList.add("active")
        }else{
            searchForm.classList.remove("active");
            weatherInfoContainer.classList.add("active");
            //now i am in Your weather tab ,  so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();

        }
    }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab)
})

const fetchWeatherInfo = async(coordinates) =>{
    let {lat,lon} = coordinates ;
    grantLocationContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        let data = await response.json();
        loadingContainer.classList.remove("active") ;
        weatherContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(e){
        loadingScreen.classList.remove("active");
    }
}

const getfromSessionStorage = () =>{
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantLocationContainer.classList.add("active");
    }else{
        let coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates)
    }
}

getfromSessionStorage();



const renderWeatherInfo=(weatherData)=>{
    //fetching elements where we want to render
    const cityName = document.querySelector("[user-name]") ;
    const cityIcon = document.querySelector("[user-cityIcon]");
    const weatherDesc = document.querySelector("[data-weather-desc]");
    const weatherIcon = document.querySelector("[data-weather-icon]") ;
    const temp = document.querySelector("[data-temp]")
    const windSpeed = document.querySelector("[wind-speed]");
    const humidity = document.querySelector("[humidity]");
    const clouds = document.querySelector("[clouds]");

    //filling data in elements
    cityName.innerText = weatherData?.name ;
    cityIcon.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherData?.weather?.[0]?.description ;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherData?.main?.temp;
    windSpeed.innerText = weatherData?.wind?.speed;
    humidity.innerText =weatherData?.main?.humidity;
    clouds.innerText = weatherData?.clouds?.all;
}





const getLocation = () =>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
       alert("Geolocation is not supported by this browser.");
      }
}

function showPosition(position) {
    const cords = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(cords));
    fetchWeatherInfo(cords)

  }

const grantAccessButton = document.querySelector("[grant-access-button]");

grantAccessButton.addEventListener("click",getLocation);


const cityInput = document.querySelector("[input-city]");

btn.addEventListener("click", (e) => {
    console.log("working")
    e.preventDefault();
    let cityname = cityInput.value;
    if (cityname === "") return;
    fetchCityweather(cityname);
});


const fetchCityweather = async(city) =>{
    loadingContainer.classList.add("active");
    grantLocationContainer.classList.remove("active");
    weatherContainer.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          let data =await response.json();
          loadingContainer.classList.remove("active");
          weatherInfoContainer.classList.add("active");
          renderWeatherInfo(data);

    }catch(e){
        throw new Error ;
    }
}




