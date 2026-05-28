"use client";

import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, DrawingManager, Marker, InfoWindow } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface LocalKnowledgeMapProps {
  lat: number;
  lng: number;
  onAreaMeasured?: (areaSqMeters: number) => void;
}

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "1rem",
};

// Define libraries outside component to prevent infinite re-renders
const libraries: ("drawing" | "geometry")[] = ["drawing", "geometry"];

export default function LocalKnowledgeMap({ lat, lng, onAreaMeasured }: LocalKnowledgeMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD2B32chOJ0bMFBZ67fl_iHtkwMtUpDhV0",
    libraries: libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindowPos, setInfoWindowPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [infoWindowMsg, setInfoWindowMsg] = useState("");
  // Keep track of drawn polygons so we can clear them if needed
  const [polygonRefs, setPolygonRefs] = useState<google.maps.Polygon[]>([]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    // Optional: if we only want 1 polygon at a time, we could clear previous ones
    polygonRefs.forEach(p => p.setMap(null));
    setPolygonRefs([polygon]);

    // Calculate area using Google's geometry library
    const path = polygon.getPath();
    const area = google.maps.geometry.spherical.computeArea(path);
    if (onAreaMeasured) {
      onAreaMeasured(area);
    }
  };

  const panToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setInfoWindowPos(pos);
          setInfoWindowMsg("Location found.");
          map?.setCenter(pos);
          map?.setZoom(18);
        },
        () => {
          setInfoWindowPos(map?.getCenter()?.toJSON() || { lat, lng });
          setInfoWindowMsg("Error: The Geolocation service failed.");
        }
      );
    } else {
      setInfoWindowPos(map?.getCenter()?.toJSON() || { lat, lng });
      setInfoWindowMsg("Error: Your browser doesn't support geolocation.");
    }
  };

  if (loadError) {
    return (
      <div className="w-full h-[500px] bg-red-500/10 flex flex-col items-center justify-center rounded-xl border border-red-500/20 text-red-500">
        <p className="font-bold">Error loading Google Maps</p>
        <p className="text-sm">{loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-surface flex items-center justify-center animate-pulse rounded-xl border border-border">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <span className="ml-3 text-muted">Loading Google Maps...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-border z-0">
      {/* Custom Button overlapping the map, adapting your snippet */}
      <button
        onClick={panToCurrentLocation}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white text-black font-semibold px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors border border-gray-300"
      >
        Pan to Current Location
      </button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat, lng }}
        zoom={18}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapTypeId="satellite" 
        options={{
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker position={{ lat, lng }} />

        {infoWindowPos && (
          <InfoWindow
            position={infoWindowPos}
            onCloseClick={() => setInfoWindowPos(null)}
          >
            <div className="text-black font-medium text-sm p-1">{infoWindowMsg}</div>
          </InfoWindow>
        )}

        <DrawingManager
          onPolygonComplete={handlePolygonComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON],
            },
            polygonOptions: {
              fillColor: "#2d6a2e",
              fillOpacity: 0.5,
              strokeWeight: 2,
              strokeColor: "#2d6a2e",
              clickable: false,
              editable: true,
              zIndex: 1,
            },
          }}
        />
      </GoogleMap>
    </div>
  );
}
