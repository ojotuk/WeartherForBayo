const currentIcon = document.querySelector("#currentIcon");
const currentTemp = document.querySelector("#currentTemp");
const currentDescription = document.querySelector("#currentDescription");
const forecast = document.querySelector("#forecast");

const apiKey = "cf433f1a53ae59ff9177bd8028acc436";
//api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
//User location
let latitude = "";
let longitude = "";
navigator.geolocation.getCurrentPosition(success, error);

//current Weather
async function success(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  // console.log(data);
  let weatherDescriptionData = data.weather[0].description;
  let weatherIconData = data.weather[0].icon;
  let currentTempData = data.main.temp;
  // console.log(currentTempData);
  // console.log(weatherDescriptionData);
  displayCurrent(weatherDescriptionData, currentTempData, weatherIconData);
  //   console.log(latitude, longitude);
  getForecast(latitude, longitude);
}
function error(err) {
  console.log(err);
}
function displayCurrent(desc, temp, icon) {
  currentDescription.innerHTML = desc;
  currentTemp.innerHTML = temp.toFixed(0);
  currentIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
}

//forecast
async function getForecast(lat, lon) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  // console.log(data);
  const dayOne = day(data.list, 0);
  const dayTwo = day(data.list, 8);
  const dayThree = day(data.list, 16);
  const dayFour = day(data.list, 24);
  const dayFive = day(data.list, 32);
  const forecastArr = [dayOne, dayTwo, dayThree, dayFour, dayFive];

  // console.log(forecastArr);
  for (params of forecastArr) {
    let prevForecast = forecast.innerHTML;
    forecast.innerHTML = `${prevForecast} 
    <div class="day">
          <h3>${params.day}</h3>
          <img src="http://openweathermap.org/img/wn/${params.icon}@2x.png" />
          <div class="description">${params.description}</div>
          <div class="temp">
            <span class="high">${params.max}℃</span>/<span class="low">${params.min}℃</span>
          </div>
        </div>
    `;
  }
}
//get days string
const dateConvert = (dt) => {
  const date = new Date(dt * 1000);
  return date.toString();
};
//get exact day name
const nameDay = (str) => {
  let day = str.split(" ")[0];
  if (day === "Mon") return "Monday";
  if (day === "Tue") return "Tuesday";
  if (day === "Wed") return "Wednesday";
  if (day === "Thu") return "Thursday";
  if (day === "Fri") return "Friday";
  if (day === "Sat") return "Saturday";
  if (day === "Sun") return "Sunday";
};
const day = (list, i) => {
  const dt = list[i].dt;
  let minDayArray = [
    list[i],
    list[i + 1],
    list[i + 2],
    list[i + 3],
    list[i + 4],
    list[i + 5],
    list[i + 6],
    list[i + 7],
  ];
  let maxDayArray = [
    list[i],
    list[i + 1],
    list[i + 2],
    list[i + 3],
    list[i + 4],
    list[i + 5],
    list[i + 6],
    list[i + 7],
  ];
  let descr = list[i + 4].weather[0].description;
  let icon = list[i + 4].weather[0].icon;
  minDayArray.sort((a, b) => {
    if (a.main.temp_min > b.main.temp_min) return -1;
  });
  maxDayArray.sort((a, b) => {
    if (a.main.temp_max > b.main.temp_max) return -1;
  });
  let dayOneMinTemp = minDayArray[7].main.temp_min;
  let dayOneMaxTemp = maxDayArray[0].main.temp_max;
  return {
    min: dayOneMinTemp.toFixed(0),
    max: dayOneMaxTemp.toFixed(0),
    day: nameDay(dateConvert(dt)),
    description: descr,
    icon: icon,
  };
};
