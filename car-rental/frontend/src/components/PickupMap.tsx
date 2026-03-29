import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

// Fix Leaflet's default icon paths missing in React
if (L && L.Icon && L.Icon.Default) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

export interface LocationPin {

  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface PickupMapProps {
  center: [number, number];
  locations: LocationPin[];
  selectedLocationId: string;
  onSelect: (id: string) => void;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

export default function PickupMap({ center, locations, selectedLocationId, onSelect }: PickupMapProps) {
  return (
    <div className="w-full h-full min-h-[250px] relative z-0 rounded-2xl overflow-hidden glass-enhanced border border-gray-800">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ width: '100%', height: '100%', minHeight: '250px', background: '#f8fafc' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapUpdater center={center} />
        
        {locations.map((loc) => {
          const isSelected = selectedLocationId === loc.id;
          const markerIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `<div style="
              width: 32px; height: 32px; 
              background: ${isSelected ? '#3b82f6' : '#1e293b'}; 
              border: 2px solid ${isSelected ? '#60a5fa' : '#334155'};
              border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 0 15px ${isSelected ? 'rgba(59,130,246,0.6)' : 'rgba(0,0,0,0.5)'};
              color: white;
              transition: all 0.2s ease;
              ${isSelected ? 'transform: scale(1.1);' : ''}
              ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          return (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]} 
              icon={markerIcon}
              eventHandlers={{
                click: () => onSelect(loc.id)
              }}
            >
              <Popup>
                <div className="font-sans">
                  <h4 className="font-bold text-gray-900 m-0">{loc.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 mb-0">Click marker to select hub.</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
