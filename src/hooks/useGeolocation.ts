"use client";

import { useState, useEffect } from "react";

export interface WeatherContext {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface LocationState {
  city: string | null;
  lat: number | null;
  lng: number | null;
  weather: WeatherContext | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<LocationState>({
    city: null,
    lat: null,
    lng: null,
    weather: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({ 
        city: "West Bengal", 
        lat: null,
        lng: null,
        weather: null,
        loading: false, 
        error: "Not supported" 
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // 1. Reverse geocode using Nominatim (OpenStreetMap)
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          const data = await geoRes.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "West Bengal";
          const stateCode = data.address.state_code || "WB";
          
          // 2. Fetch Weather using Open-Meteo
          let weather: WeatherContext | null = null;
          try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
            if (weatherRes.ok) {
              const wData = await weatherRes.json();
              weather = {
                temp: wData.current.temperature_2m,
                humidity: wData.current.relative_humidity_2m,
                windSpeed: wData.current.wind_speed_10m,
                description: "Code " + wData.current.weather_code // Minimal mapping
              };
            }
          } catch (e) {
            console.error("Failed to fetch weather context", e);
          }
          
          setState({ 
            city: `${city}, ${stateCode}`, 
            lat: latitude,
            lng: longitude,
            weather,
            loading: false, 
            error: null 
          });
        } catch (err) {
          setState({ city: "Bhātpāra, WB", lat: null, lng: null, weather: null, loading: false, error: "Geocoding failed" });
        }
      },
      (error) => {
        setState({ city: "Bhātpāra, WB", lat: null, lng: null, weather: null, loading: false, error: error.message });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  return state;
}
