import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function JobMap({ latitude, longitude, adress }) {
  if (!latitude || !longitude) {
    console.error("Latitude and Longitude must be provided.");
    return null;
  }

  const center = [latitude, longitude];

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-300 shadow-sm bg-white">
      <div className="h-80 w-full">
        <MapContainer
          center={center}
          zoom={12}
          zoomControl={true}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={center} icon={DefaultIcon} />
        </MapContainer>
      </div>

      {adress && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium">
              Lokalizacja: <span>{adress}</span>
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
