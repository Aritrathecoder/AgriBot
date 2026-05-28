"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Cloud, Droplets, Wind, Ruler, Loader2, AlertCircle, Compass } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Dynamically import the map component with SSR disabled
const LocalKnowledgeMap = dynamic(() => import("@/components/LocalKnowledgeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-surface flex items-center justify-center animate-pulse rounded-2xl border border-border">
      <Loader2 className="animate-spin text-primary w-10 h-10" />
      <span className="ml-3 text-muted">Loading Map...</span>
    </div>
  ),
});

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface LocationDetails {
  ward: string;
  suburb: string;
  city: string;
  state: string;
  displayName: string;
}

function getWmoCodeDetails(code: number, isDay: boolean = true): { description: string, icon: string } {
  const map: Record<number, { description: string, icon: string }> = {
    0: { description: "Clear sky", icon: isDay ? "☀️" : "🌙" },
    1: { description: "Mainly clear", icon: isDay ? "🌤️" : "🌑" },
    2: { description: "Partly cloudy", icon: isDay ? "⛅" : "☁️" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Fog", icon: "🌫️" },
    48: { description: "Depositing rime fog", icon: "🌫️" },
    51: { description: "Light drizzle", icon: "🌧️" },
    53: { description: "Moderate drizzle", icon: "🌧️" },
    55: { description: "Dense drizzle", icon: "🌧️" },
    56: { description: "Light freezing drizzle", icon: "🌧️" },
    57: { description: "Dense freezing drizzle", icon: "🌧️" },
    61: { description: "Slight rain", icon: "🌧️" },
    63: { description: "Moderate rain", icon: "🌧️" },
    65: { description: "Heavy rain", icon: "🌧️" },
    66: { description: "Light freezing rain", icon: "🌧️" },
    67: { description: "Heavy freezing rain", icon: "🌧️" },
    71: { description: "Slight snow fall", icon: "❄️" },
    73: { description: "Moderate snow fall", icon: "❄️" },
    75: { description: "Heavy snow fall", icon: "❄️" },
    77: { description: "Snow grains", icon: "❄️" },
    80: { description: "Slight rain showers", icon: "🌦️" },
    81: { description: "Moderate rain showers", icon: "🌦️" },
    82: { description: "Violent rain showers", icon: "🌦️" },
    85: { description: "Slight snow showers", icon: "🌨️" },
    86: { description: "Heavy snow showers", icon: "🌨️" },
    95: { description: "Thunderstorm", icon: "⛈️" },
    96: { description: "Thunderstorm with slight hail", icon: "⛈️" },
    99: { description: "Thunderstorm with heavy hail", icon: "⛈️" },
  };
  return map[code] || { description: "Unknown", icon: "🌍" };
}

export default function LocalKnowledgePage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [areaSqMeters, setAreaSqMeters] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [locationRequested, setLocationRequested] = useState(false);

  const requestLocation = () => {
    setLocationRequested(true);
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        try {
          // 1. Fetch Weather Data (Open-Meteo)
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day`);
          if (weatherRes.ok) {
            const wData = await weatherRes.json();
            const current = wData.current;
            const wmo = getWmoCodeDetails(current.weather_code, current.is_day === 1);
            
            setWeather({
              temp: current.temperature_2m,
              humidity: current.relative_humidity_2m,
              windSpeed: current.wind_speed_10m,
              description: wmo.description,
              icon: wmo.icon
            });
          } else {
            const errorData = await weatherRes.json();
            setWeatherError(errorData.reason || "Failed to load weather data.");
            console.error("Weather API Error:", errorData);
          }

          // 2. Fetch Location/Ward Details (Reverse Geocoding)
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          if (geoRes.ok) {
            const gData = await geoRes.json();
            setLocationDetails({
              ward: gData.address.suburb || gData.address.neighbourhood || gData.address.village || "Unknown Ward",
              suburb: gData.address.suburb || gData.address.county || "",
              city: gData.address.city || gData.address.town || gData.address.state_district || "",
              state: gData.address.state || "",
              displayName: gData.display_name
            });
          }
        } catch (err) {
          console.error("Failed to fetch local data:", err);
          setError("Failed to fetch local data. Please check your internet connection.");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError(`Location access denied or failed: ${err.message}`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4 max-w-5xl">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-background transition-colors text-muted hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Compass size={18} />
            </div>
            <h1 className="font-bold text-lg text-foreground">Local Knowledge Geo-Survey</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 max-w-5xl">
        {!locationRequested ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border rounded-2xl p-8 max-w-2xl mx-auto mt-10 shadow-sm">
            <Compass className="w-16 h-16 text-primary mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Local Knowledge</h2>
            <p className="text-muted mb-8 max-w-md">
              To provide you with hyper-local weather, land measurement tools, and local conditions, we need your permission to access your current location.
            </p>
            <button 
              onClick={requestLocation}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
            >
              <MapPin size={20} />
              Use My Current Location
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
            <p className="text-muted">Detecting your location and fetching local data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center text-center">
            <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
            <h2 className="text-red-600 font-bold text-lg mb-2">Location Error</h2>
            <p className="text-red-500/80 mb-4">{error}</p>
            <p className="text-sm text-muted">Please ensure you have granted location permissions to this site.</p>
          </div>
        ) : location ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar (Data) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Location Card */}
              <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
                    <MapPin size={20} />
                  </div>
                  <h2 className="font-bold text-foreground">Location Details</h2>
                </div>
                {locationDetails ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">Ward / Locality</p>
                      <p className="font-medium text-foreground text-lg">{locationDetails.ward}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">City / District</p>
                      <p className="text-foreground">{locationDetails.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">State</p>
                      <p className="text-foreground">{locationDetails.state}</p>
                    </div>
                    <div className="pt-2 border-t border-border mt-2">
                      <p className="text-xs text-muted font-mono break-all">
                        GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted text-sm">Location details unavailable.</p>
                )}
              </div>

              {/* Weather Card */}
              <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                    <Cloud size={20} />
                  </div>
                  <h2 className="font-bold text-foreground">Current Weather</h2>
                </div>
                {weather ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-3xl font-bold text-foreground">{Math.round(weather.temp)}°C</span>
                        <span className="text-sm text-muted capitalize">{weather.description}</span>
                      </div>
                      <div className="text-6xl drop-shadow-md leading-none select-none">{weather.icon}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Droplets size={16} className="text-blue-400" />
                        <div>
                          <p className="text-xs text-muted">Humidity</p>
                          <p className="font-medium text-sm text-foreground">{weather.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind size={16} className="text-teal-400" />
                        <div>
                          <p className="text-xs text-muted">Wind</p>
                          <p className="font-medium text-sm text-foreground">{weather.windSpeed} m/s</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <p className="text-muted text-sm mb-2">Weather data unavailable.</p>
                    {weatherError && (
                      <p className="text-xs text-red-500 font-mono bg-red-500/10 p-2 rounded border border-red-500/20">
                        API Error: {weatherError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Area Calculation Card */}
              <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                    <Ruler size={20} />
                  </div>
                  <h2 className="font-bold text-foreground">Land Measurement</h2>
                </div>
                {areaSqMeters > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-border pb-2">
                      <span className="text-muted text-sm">Square Meters</span>
                      <span className="font-bold text-foreground">{areaSqMeters.toFixed(2)} m²</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-border pb-2">
                      <span className="text-muted text-sm">Acres</span>
                      <span className="font-bold text-foreground">{(areaSqMeters * 0.000247105).toFixed(4)} ac</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-muted text-sm">Hectares</span>
                      <span className="font-bold text-foreground">{(areaSqMeters / 10000).toFixed(4)} ha</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted mb-2">Use the polygon tool on the map to draw around your land to measure its area.</p>
                    <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                      <span className="text-muted">Area</span>
                      <span className="font-medium text-foreground">0.00 m²</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Map Area */}
            <div className="lg:col-span-2">
              <LocalKnowledgeMap lat={location.lat} lng={location.lng} onAreaMeasured={setAreaSqMeters} />
              <p className="text-xs text-center text-muted mt-3">
                <span className="font-semibold">Tip:</span> Click the polygon icon on the top center of the map to draw your field boundary and calculate its area.
              </p>
            </div>

          </div>
        ) : null}
      </main>
    </div>
  );
}
