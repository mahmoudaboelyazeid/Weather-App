
function getWeatherIconPath(code) {
  if (code === 0) return "/weather-app-main/weather-app-main/assets/images/icon-sunny.webp";          // صافي
  if (code === 1) return "/weather-app-main/weather-app-main/assets/images/icon-partly-cloudy.webp";  // جزئي سحاب
  if (code === 2) return "/weather-app-main/weather-app-main/assets/images/icon-overcast.webp";         // غائم
  if (code === 3) return "/weather-app-main/weather-app-main/assets/images/icon-overcast.webp";       // غائم كثيف
  if ([45, 48].includes(code)) return "/weather-app-main/weather-app-main/assets/images/icon-fog.webp";       // ضباب
  if ([51, 53, 55].includes(code)) return "/weather-app-main/weather-app-main/assets/images/icon-drizzle.webp"; // رذاذ
  if ([61, 63, 65].includes(code)) return "/weather-app-main/weather-app-main/assets/images/icon-rain.webp";    // مطر
  if ([71, 73, 75].includes(code)) return "/weather-app-main/weather-app-main/assets/images/icon-snow.webp";    // ثلج
  if ([80, 81, 82].includes(code)) return "/weather-app-main/weather-app-main/assets/images/icon-rain.webp"; // أمطار متقطعة
  if ([95, 96, 99].includes(code)) return "/weather-app-main/weather-app-main/assets/images/icon-storm.webp"; // عواصف رعدية
  return "https://imgs.search.brave.com/P2MCJnNG2GXh8rFXwc-D-6uSSM81Lm2wbme097sJFQs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi91bmtub3du/LXdlYXRoZXItNDEy/NzMzNS0zNDI1NjM5/LnBuZz9mPXdlYnAm/dz0xMjg"; // حالة غير معروفة
}

function updateCurrentWeather(current, units) {
  const time = new Date(current.time);
  document.getElementById("time").textContent = time.toDateString();
  document.getElementById("temp").textContent = `${current.temperature_2m}°`;
  document.getElementById("wind").textContent = `${current.wind_speed_10m} ${units.wind_speed_10m}`;
  document.getElementById("humidity").textContent = `${current.relative_humidity_2m}${units.relative_humidity_2m}`;
  document.getElementById("precit").textContent = `${current.precipitation}mm`;
}

function createDailyCard(daily, index) {
  const card = document.createElement("div");
  card.className = "day effect info_daily";

  const dayShort = new Date(daily.time[index]).toLocaleDateString('en-US', { weekday: "short" });
  const iconPath = getWeatherIconPath(daily.weather_code[index]);

  card.innerHTML = `
    <p class="dateShort">${dayShort}</p>
    <img src="${iconPath}" alt="weather icon">
    <div class="nummbers d-flex justify-content-between align-items-center">
      <p class="temp_max">${daily.temperature_2m_max[index]}°</p>
      <p class="sp temp_min">${daily.temperature_2m_min[index]}°</p>
    </div>
  `;

  return card;
}

function updateDailyForecast(daily) {
  const parent = document.getElementById("day_detail");
  parent.innerHTML = ""; // تمسح الكروت القديمة

  for (let i = 0; i < daily.time.length; i++) {
    const card = createDailyCard(daily, i);
    parent.appendChild(card);
  }
}

function updateDropdowndaily(time) {
  let menu = document.getElementById("dropdown-menu");
  let dropdownbtn = document.getElementById("dropdown-btn");


  let current_day = new Date(time[0]).toLocaleDateString('en-US', { weekday: "short" });

  dropdownbtn.textContent = current_day;

  menu.innerHTML = "";
  for (let i = 0; i <= time.length - 1; i++) {
    const dayShort = new Date(time[i]).toLocaleDateString('en-US', { weekday: "short" });
    const li = document.createElement("li")
    li.innerHTML = `<a class="dropdown-item" href="#">${dayShort}</a>`
    menu.appendChild(li);

    li.addEventListener("click", () => {
      dropdownbtn.textContent = dayShort;

      const dailytime = time;
      const new_day = dayShort;

      const foundDate = dailytime.find(found =>
        new Date(found).toLocaleDateString('en-US', { weekday: 'short' }) === new_day
      );
      console.log(foundDate)
    })
  }
}


function updatehourlyforecast(hourly) {
  let parent_2 = document.getElementById("hour_detail");
  parent_2.innerHTML = ""; // مسح الكروت القديمه
  for (let i = 0; i <= 6; i++) {
    const card = createhourlyCard(hourly, i);
    parent_2.appendChild(card);
  }
}

function createhourlyCard(hourly, index) {
  const card = document.createElement("div");
  card.className = "hourly-detail d-flex justify-content-between align-items-center";

  let weathericon = getWeatherIconPath(hourly.weather_code[index])
  let time = hourly.time[index];

  let date = new Date(time);
  let hourTime = date.toLocaleTimeString('en-US', { hour: '2-digit' });

  card.innerHTML = `
    <div class="status">
    <img src="${weathericon}" alt="weather icon">
    <span>${hourTime}</span>
    </div>
    <div class="digree">
      <p>${hourly.temperature_2m[index]}°</p>
    </div>
  `
  return card;
}


async function SelectCityName(lat, lon) {
  try {
    let response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    console.log(response)
    let cityName = `${response.data.city} , ${response.data.countryName}`
    let name = document.getElementById("city");
    name.textContent = cityName;
  } catch (error) {
    console.log("error get to city name", error)
  }
}

async function Get_Weather_Req() {
  try {

    let response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=wind_speed_10m,precipitation,temperature_2m,relative_humidity_2m&wind_speed_unit=mph')
    const result = response.data;
    console.log(result);

    // تحديث الطقس الحالي
    updateCurrentWeather(result.current, result.current_units);

    // تحديث توقعات الأيام القادمة
    updateDailyForecast(result.daily);

    // السبع ساعات فقط 
    updatehourlyforecast(result.hourly);

    // عدد الايام deopdown
    updateDropdowndaily(result.daily.time)
    // اسم المدينه 
    SelectCityName(result.latitude, result.longitude)

  } catch (error) {
    console.error("Error fetching weather data:", error);
  };
}

Get_Weather_Req();

// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=30.0444&longitude=31.2357&localityLanguage=en
