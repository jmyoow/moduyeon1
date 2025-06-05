const API_KEY = '127de5115e7b526001622be25611041f';

const input = document.getElementById('city-input');
const button = document.getElementById('search-btn');
const result = document.getElementById('result');
const cityName = document.getElementById('city-name');
const weatherInfo = document.getElementById('weather-info');

// Event
button.addEventListener('click', searchWeather);
input.addEventListener('keydown', e => {
  // console.log(e.key);
  if (e.key === 'Enter') {
    searchWeather();
  }
});

function setBackground(weather) {
  switch (weather) {
    case 'clear':
      document.body.style.background = 'lightcyan';
      break;
    case 'cloud':
      document.body.style.background = 'darkgray';
      break;
    case 'rain':
      document.body.style.background = 'cadetblue';
      break;
    case 'snow':
      document.body.style.background = 'azure';
      break;
  }
}

async function searchWeather() {
  const city = input.value.trim();

  if (!city) {
    alert('도시 이름을 입력하세요.');
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
      throw new Error('도시를 찾을 수 없어요!');
    }

    // 조회 성공
    const data = await res.json();
    const name = data.name;
    const temp = data.main.temp;
    const desc = data.weather[0].description;

    cityName.textContent = name;
    weatherInfo.textContent = `섭씨 ${temp}도 / ${desc}`;
    result.classList.remove('hidden');

    let weatherStr = '';
    if (desc.indexOf('clear') >= 0) {
      weatherStr = 'clear';
    } else if (desc.indexOf('cloud') >= 0) {
      weatherStr = 'cloud';
    } else if (desc.indexOf('rain') >= 0) {
      weatherStr = 'rain';
    } else if (desc.indexOf('snow') >= 0) {
      weatherStr = 'snow';
    } else {
      weatherStr = '???';
    }
    
    setBackground(weatherStr);

  } catch (err) {
    alert(err.message);
  }
}