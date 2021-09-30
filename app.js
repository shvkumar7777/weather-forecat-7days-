const timeEle = document.getElementById('time');
const ampmEle = document.getElementById('am-pm');
const dateEle = document.getElementById('date');
const timezoneEle = document.getElementById('time-zone');
const latlanEle = document.querySelector('.latlan');
const currentWeatherINfo = document.getElementById('current-weather-info')
const weatherforecast = document.getElementById('weather-forecast');
const todayEle = document.getElementById('today');


const API_key = '732dfe14457be78432c34ec7094069df';
const API = `https://api.openweathermap.org/data/2.5/onecall?`;
// let full_api;
let data;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();//Spet
    const date = time.getDate();//30th
    const day = time.getDay();//Thursday
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const hoursin12hourformat = hour >= 13 ? hour % 12 : hour;
    const ampm = hour > 12 ? 'PM' : 'AM';

    timeEle.innerHTML = `${hoursin12hourformat}:${minutes}<span id="am-pm">${ampm}</span>`;
    dateEle.textContent = days[`${ day }`]+","+`${date}`+months[`${month}`];
    // console.log(Month + day + time);
}, 1000);

function updateDOM(data) {
    const { timezone } = data;
    const { lat, lon } = data;
    const { pressure, humidity, wind_speed , sunrise, sunset } = data.current;
    // console.log(name);
    timezoneEle.textContent = `${timezone}`;
    latlanEle.textContent = `${lat}/${lon}`;
    currentWeatherINfo.innerHTML  = `<div class="items">
    <div>Humidity</div>  
    <div>${humidity}%</div>
</div>
<div class="items">
    <div>Pressure</div>  
    <div>${pressure}</div>
</div>
<div class="items">
    <div>Wind speed</div>  
    <div>${wind_speed}</div>
</div>
<div class="items">
    <div>SunRise</div>  
    <div>${window.moment(sunrise*1000).format('HH:MM a')}</div>
</div>
<div class="items">
    <div>Sunset</div>  
    <div>${window.moment(sunset*1000).format('HH:MM')}</div>
</div>`
    let otherdayforecast = '';
    data.daily.forEach((day,index) => {
        if (index==0) {
            todayEle.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" srcset="">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <div class="day-temp">Day - ${day.temp.day}&#176 C</div>
            <div class="night-temp">Night - ${day.temp.night}&#176 C</div>
            `
        } else {
            otherdayforecast += `
            <div class="weather-forecast-item" id="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" alt="weather icon" srcset="">
                <div class="day-temp">Day - ${day.temp.day}&#176 C</div>
                <div class="night-temp">Night - ${day.temp.night}&#176 C</div>
            </div>
            `
        }
    });

    weatherforecast.innerHTML = otherdayforecast;
}

async function getWeatherData(full_api) {
    try {
        let response = await fetch(full_api);
        let data = await response.json();
        // console.log(data);
        //update the DOM
        updateDOM(data);
    } catch (error) {
        console.log(error.data);
    }
    
}

window.addEventListener('load', () => {
    
    //check for the current location lat and lang and update those to the DOM
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success => {
            // console.log(success);
            // object destructure
            let { latitude, longitude } = success.coords;
            latlanEle.textContent = `${latitude}/${longitude}`;
            let full_api = API.concat(`lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_key}`);
            // console.log(full_api);
            getWeatherData(full_api);
        });
    } else {
        window.alert("Please enable the location");
    }
});