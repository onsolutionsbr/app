import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Map from '../../components/Map';

interface LocationState {
  pickup: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  price: number;
  distance: number;
  requestId: string;
}

function WaitingDriver() {
  const location = useLocation();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [searching, setSearching] = useState(true);
  const [driverAccepted, setDriverAccepted] = useState(false);
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.requestId) {
      navigate('/mobility/request');
      return;
    }

    // Simulate finding a driver
    const timer = setTimeout(() => {
      setDriver({
        id: 'drv_1',
        name: 'Carlos Silva',
        rating: 4.8,
        totalRides: 1256,
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
        car: {
          model: 'Toyota Corolla',
          color: 'Prata',
          plate: 'ABC-1234'
        },
        location: {
          lat: state.pickup.lat - 0.002,
          lng: state.pickup.lng - 0.002
        }
      });
      setSearching(false);
      toast.success('Motorista encontrado!');
    }, 5000);

    return () => clearTimeout(timer);
  }, [state, navigate]);

  const handleDriverAccept = () => {
    setDriverAccepted(true);
    toast.success('Motorista a caminho!');
    
    setTimeout(() => {
      navigate('/mobility/active-ride', {
        state: {
          requestId: state.requestId,
          driver,
          pickup: state.pickup,
          destination: state.destination,
          price: state.price,
          distance: state.distance
        },
        replace: true
      });
    }, 1000);
  };

  const handleCancel = () => {
    if (window.confirm('Deseja realmente cancelar a corrida?')) {
      navigate('/mobility/request');
    }
  };

  if (!state?.requestId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {searching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="text-xl font-semibold mt-6 mb-2">
                Procurando motoristas próximos...
              </h2>
              <p className="text-gray-600 mb-6">
                Aguarde enquanto encontramos o motorista mais próximo
              </p>
            </div>
          ) : driver && !driverAccepted ? (
            <>
              <div className="text-center mb-6">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{driver.name}</h2>
                <div className="flex items-center justify-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">({driver.totalRides} corridas)</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="font-medium text-gray-900">{driver.car.model}</p>
                  <p className="text-gray-600">{driver.car.color} • {driver.car.plate}</p>
                </div>
              </div>

              <Map
                origin={{ lat: state.pickup.lat, lng: state.pickup.lng }}
                destination={{ lat: state.destination.lat, lng: state.destination.lng }}
                providerLocation={{ lat: driver.location.lat, lng: driver.location.lng }}
              />

              <div className="mt-6 space-y-4">
                <button
                  onClick={handleDriverAccept}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Aceitar Motorista
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="h-16 w-16 bg-blue-600 rounded-full mx-auto"></div>
                <h2 className="text-xl font-semibold mt-6 mb-2">
                  Motorista a caminho!
                </h2>
                <p className="text-gray-600 mb-6">
                  Redirecionando para o acompanhamento da corrida...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaitingDriver;