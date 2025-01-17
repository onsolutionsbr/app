import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Map from '../../components/Map';
import SplitView from '../../components/SplitView';

interface LocationState {
  requestId: string;
  driver: {
    id: string;
    name: string;
    rating: number;
    totalRides: number;
    photo: string;
    car: {
      model: string;
      color: string;
      plate: string;
    };
    location: {
      lat: number;
      lng: number;
    };
  };
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
}

function ActiveRide() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'arriving' | 'arrived' | 'in_progress' | 'completed'>('arriving');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const state = location.state as LocationState;

  if (!state?.requestId || !state?.driver) {
    navigate('/mobility/request');
    return null;
  }

  const handleDriverArrival = () => {
    setStatus('arrived');
    toast.success('Motorista chegou ao local!');
  };

  const handleStartRide = () => {
    setStatus('in_progress');
    toast.success('Corrida iniciada!');
  };

  const handleCompleteRide = () => {
    setStatus('completed');
    setShowRating(true);
  };

  const handleSubmitRating = () => {
    toast.success('Avaliação enviada com sucesso!');
    setTimeout(() => navigate('/mobility/request'), 1500);
  };

  const PassengerView = (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Driver Info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <img
                src={state.driver.photo}
                alt={state.driver.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{state.driver.name}</h3>
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(state.driver.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">({state.driver.totalRides} corridas)</span>
                </div>
                <p className="text-gray-600 mt-1">
                  {state.driver.car.model} • {state.driver.car.color} • {state.driver.car.plate}
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="p-6 border-b">
            <Map
              origin={{ lat: state.pickup.lat, lng: state.pickup.lng }}
              destination={{ lat: state.destination.lat, lng: state.destination.lng }}
              providerLocation={{ lat: state.driver.location.lat, lng: state.driver.location.lng }}
            />
          </div>

          {/* Status */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {status === 'arriving' && 'Motorista a caminho'}
                {status === 'arrived' && 'Motorista no local'}
                {status === 'in_progress' && 'Em viagem'}
                {status === 'completed' && 'Finalizado'}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {status === 'arrived' && (
                <button
                  onClick={handleStartRide}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Iniciar Viagem
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Avaliar Corrida</h3>
            
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-3xl focus:outline-none"
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deixe um comentário sobre sua experiência..."
                className="w-full border border-gray-300 rounded-md p-2 h-32"
              />

              <button
                onClick={handleSubmitRating}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const DriverView = (
    <div className="p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-4">Painel do Motorista</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Detalhes da Corrida</h3>
          <p className="text-gray-600">Distância: {state.distance.toFixed(2)} km</p>
          <p className="text-gray-600">Valor: R$ {state.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Status da Corrida</h4>
          <p className="text-blue-600">{
            status === 'arriving' ? 'A caminho do passageiro' :
            status === 'arrived' ? 'No local de embarque' :
            status === 'in_progress' ? 'Em viagem' :
            'Finalizada'
          }</p>
        </div>

        {status === 'arriving' && (
          <button
            onClick={handleDriverArrival}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Cheguei ao Local
          </button>
        )}

        {status === 'in_progress' && (
          <button
            onClick={handleCompleteRide}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Finalizar Corrida
          </button>
        )}
      </div>
    </div>
  );

  return (
    <SplitView
      clientView={PassengerView}
      providerView={DriverView}
    />
  );
}

export default ActiveRide;