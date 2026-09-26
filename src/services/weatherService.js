/**
 * BHOOMIRAKSHAK Weather Intelligence Service
 * Powered by Open-Meteo Weather API (Free, no API key required)
 * Documentation: https://open-meteo.com/en/docs
 */

// In-memory weather cache to prevent excessive API calls
const weatherCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// WMO Weather interpretation codes (WW)
const WMO_CODE_MAP = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌧️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌧️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '⛈️' },
  71: { label: 'Slight snow fall', icon: '🌨️' },
  73: { label: 'Moderate snow fall', icon: '🌨️' },
  75: { label: 'Heavy snow fall', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Moderate rain showers', icon: '🌧️' },
  82: { label: 'Violent rain showers', icon: '⛈️' },
  85: { label: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⚡' },
  96: { label: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️' }
};

export function getWeatherCondition(code) {
  return WMO_CODE_MAP[code] || { label: 'Cloudy / Overcast', icon: '☁️' };
}

/**
 * Fetch current weather and hourly forecasts for a given coordinate
 */
export async function getLocationWeather(latitude, longitude) {
  if (latitude == null || longitude == null) return null;

  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  const now = Date.now();

  if (weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    const current = json.current || {};
    const condition = getWeatherCondition(current.weather_code);

    // Prepare clean next 12-hour forecast slice
    const hourlyTimes = json.hourly?.time || [];
    const hourlyTemps = json.hourly?.temperature_2m || [];
    const hourlyRains = json.hourly?.precipitation || [];
    const hourlyProbs = json.hourly?.precipitation_probability || [];
    const hourlyCodes = json.hourly?.weather_code || [];

    const currentHourIndex = Math.max(
      0,
      hourlyTimes.findIndex(t => new Date(t).getHours() === new Date().getHours())
    );

    const hourly = [];
    const sliceCount = 12;
    for (let i = currentHourIndex; i < currentHourIndex + sliceCount && i < hourlyTimes.length; i++) {
      const timeStr = hourlyTimes[i];
      const hourLabel = new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      hourly.push({
        time: hourLabel,
        temp: Math.round(hourlyTemps[i] ?? current.temperature_2m ?? 24),
        rain: Number((hourlyRains[i] ?? 0).toFixed(1)),
        rainProb: Math.round(hourlyProbs[i] ?? 0),
        condition: getWeatherCondition(hourlyCodes[i])
      });
    }

    const result = {
      isLive: true,
      lastUpdated: new Date(),
      temperature: Math.round(current.temperature_2m ?? 25),
      apparentTemperature: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 26),
      humidity: Math.round(current.relative_humidity_2m ?? 75),
      precipitation: Number((current.precipitation ?? 0).toFixed(1)),
      rain: Number((current.rain ?? 0).toFixed(1)),
      windSpeed: Math.round(current.wind_speed_10m ?? 8),
      windDirection: Math.round(current.wind_direction_10m ?? 120),
      cloudCover: Math.round(current.cloud_cover ?? 50),
      condition: condition.label,
      conditionIcon: condition.icon,
      weatherCode: current.weather_code,
      hourly
    };

    weatherCache.set(cacheKey, { timestamp: now, data: result });
    return result;
  } catch (err) {
    console.warn(`[WeatherService] Could not fetch live weather for (${latitude}, ${longitude}):`, err.message);

    // Fallback data if API is temporarily unreachable
    return {
      isLive: false,
      lastUpdated: new Date(),
      temperature: 27,
      apparentTemperature: 29,
      humidity: 82,
      precipitation: 4.2,
      rain: 4.2,
      windSpeed: 9,
      windDirection: 140,
      cloudCover: 75,
      condition: 'Intermittent Rain',
      conditionIcon: '🌧️',
      weatherCode: 61,
      errorNotice: 'Live weather temporarily unavailable, using baseline telemetry',
      hourly: [
        { time: '12:00', temp: 28, rain: 2.1, rainProb: 70, condition: { label: 'Rain', icon: '🌧️' } },
        { time: '14:00', temp: 29, rain: 4.5, rainProb: 85, condition: { label: 'Heavy Rain', icon: '⛈️' } },
        { time: '16:00', temp: 27, rain: 3.2, rainProb: 80, condition: { label: 'Rain', icon: '🌧️' } },
        { time: '18:00', temp: 26, rain: 1.8, rainProb: 60, condition: { label: 'Drizzle', icon: '🌦️' } },
        { time: '20:00', temp: 25, rain: 0.8, rainProb: 40, condition: { label: 'Cloudy', icon: '☁️' } }
      ]
    };
  }
}

/**
 * Convenience helper for getting current weather
 */
export async function getCurrentWeather(latitude, longitude) {
  return await getLocationWeather(latitude, longitude);
}

/**
 * Convenience helper for getting hourly weather
 */
export async function getHourlyWeather(latitude, longitude) {
  const data = await getLocationWeather(latitude, longitude);
  return data?.hourly || [];
}

/**
 * Convenience helper for getting daily weather
 */
export async function getDailyWeather(latitude, longitude) {
  if (latitude == null || longitude == null) return [];
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`);
    if (res.ok) {
      const json = await res.json();
      return (json.daily?.time || []).map((date, idx) => ({
        date,
        maxTemp: Math.round(json.daily.temperature_2m_max[idx] ?? 28),
        minTemp: Math.round(json.daily.temperature_2m_min[idx] ?? 20),
        precipitation: Number((json.daily.precipitation_sum[idx] ?? 0).toFixed(1)),
        condition: getWeatherCondition(json.daily.weather_code[idx])
      }));
    }
  } catch (e) {
    console.warn('[WeatherService] getDailyWeather fallback:', e.message);
  }
  return [];
}

/**
 * Geocoding helper resolving location name to coordinates
 */
export async function getLocationCoordinates(locationName) {
  if (!locationName) return null;
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`);
    if (res.ok) {
      const data = await res.json();
      const first = data.results?.[0];
      if (first) {
        return {
          name: first.name,
          latitude: first.latitude,
          longitude: first.longitude,
          district: first.admin1,
          country: first.country
        };
      }
    }
  } catch (e) {
    console.warn('[WeatherService] getLocationCoordinates fallback:', e.message);
  }
  return null;
}
