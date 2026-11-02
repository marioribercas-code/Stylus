/**
 * Servicio de Clima con Open-Meteo API (Gratuito, sin API key requerida)
 * Proporciona previsión meteorológica e interpretaciones de vestimenta para moda masculina.
 */

export async function fetchCurrentWeather(lat = 40.4168, lon = -3.7038) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al conectar con el servicio meteorológico');
    const data = await response.json();

    const current = data.current;
    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const rain = current.rain > 0 || current.precipitation > 0;
    const weatherCode = current.weather_code;

    // Interpretación de código meteorológico WMO
    let condition = 'Despejado';
    let icon = 'sun';
    if (weatherCode >= 1 && weatherCode <= 3) {
      condition = 'Parcialmente Nublado';
      icon = 'cloud-sun';
    } else if (weatherCode >= 45 && weatherCode <= 48) {
      condition = 'Niebla / Neblina';
      icon = 'cloud-fog';
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      condition = 'Lluvia / Llovizna';
      icon = 'cloud-rain';
    } else if (weatherCode >= 71) {
      condition = 'Nieve / Frío Intenso';
      icon = 'snowflake';
    }

    // Reglas de estilismo por temperatura
    let advice = '';
    let layerType = '';

    if (temp < 10) {
      layerType = 'Abrigo Pesado';
      advice = 'Frío intenso. Ideal para superponer abrigo de lana o plumas sobre jersey de cuello cisne. Calzado de cuero cerrado con suela aislante.';
    } else if (temp >= 10 && temp < 17) {
      layerType = 'Capas de Entretiempo';
      advice = 'Fresco agradable. Momento estelar para americana de lana, cazadora biker o abrigo ligero sobre camisa.';
    } else if (temp >= 17 && temp < 24) {
      layerType = 'Ligero / Smart Casual';
      advice = 'Temperatura óptima. Una sobrecamisa abierta de algodón sobre camiseta o camisa Oxford con mangas remangadas.';
    } else {
      layerType = 'Calor / Tejidos Transpirables';
      advice = 'Día cálido. Tejidos transpirables (lino 100%, algodón pima), polos de punto y mocasines o sneakers ligeras.';
    }

    if (rain) {
      advice += ' ⚠️ Posibilidad de lluvia: descarta calzado de ante y opta por cuero encerado o botas Chelsea con suela de goma.';
    }

    return {
      temp,
      feelsLike,
      condition,
      isRain: rain,
      windSpeed: current.wind_speed_10m,
      layerType,
      advice,
      city: 'Madrid / Tu Ubicación'
    };
  } catch (err) {
    console.warn('Fallback al clima por defecto:', err);
    return {
      temp: 18,
      feelsLike: 17,
      condition: 'Parcialmente Nublado',
      isRain: false,
      windSpeed: 12,
      layerType: 'Capas de Entretiempo',
      advice: 'Temperatura ideal para entretiempo: americana desestructurada sobre camisa Oxford o polo de punto.',
      city: 'Modo Local'
    };
  }
}
