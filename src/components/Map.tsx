import React from 'react';

interface MapProps {
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  providerLocation?: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({ origin, destination, providerLocation }) => {
  // If no coordinates are provided, show a placeholder map
  if (!origin && !destination) {
    return (
      <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Selecione os pontos no mapa</p>
      </div>
    );
  }

  // If we have coordinates, show the map with the route
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md bg-gray-100 relative">
      <iframe
        src="https://maps.app.goo.gl/4Y39CPvTdiy8RSvM9"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {providerLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {origin && destination ? 'Motorista a caminho' : 'Profissional a caminho'}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(
                Math.sqrt(
                  Math.pow(destination?.lat! - providerLocation.lat, 2) +
                  Math.pow(destination?.lng! - providerLocation.lng, 2)
                ) * 1000
              )} metros
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;