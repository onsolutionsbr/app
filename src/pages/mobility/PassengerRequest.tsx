import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Map from '../../components/Map';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

function PassengerRequest() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [distance, setDistance] = useState(0);

  // Mock function to calculate price based on distance
  const calculatePrice = (distanceInKm: number) => {
    const basePrice = 5.00; // Base fare
    const pricePerKm = 2.50; // Price per kilometer
    return basePrice + (distanceInKm * pricePerKm);
  };

  const handleLocationSelect = (type: 'pickup' | 'destination', location: Location) => {
    if (type === 'pickup') {
      setPickup(location);
    } else {
      setDestination(location);
    }

    if (pickup && type === 'destination') {
      // Calculate distance between points (mock calculation)
      const distanceInKm = Math.sqrt(
        Math.pow(location.lat - pickup.lat, 2) + 
        Math.pow(location.lng - pickup.lng, 2)
      ) * 111; // Rough conversion to kilometers

      setDistance(distanceInKm);
      setEstimatedPrice(calculatePrice(distanceInKm));
    }
  };

  const handleRequestRide = () => {
    if (!pickup || !destination) {
      toast.error('Por favor, selecione os pontos de embarque e destino');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/mobility/waiting-driver', {
        state: {
          pickup,
          destination,
          price: estimatedPrice,
          distance,
          requestId: 'ride_' + Date.now()
        }
      });
      
      toast.success('Procurando motorista próximo...');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Solicitar Corrida</h2>

          {/* Map */}
          <div className="mb-6">
            <Map
              origin={pickup ? { lat: pickup.lat, lng: pickup.lng } : undefined}
              destination={destination ? { lat: destination.lat, lng: destination.lng } : undefined}
            />
          </div>

          {/* Location Selection */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local de Embarque
              </label>
              <input
                type="text"
                placeholder="Digite o endereço de embarque"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  // Mock location selection
                  handleLocationSelect('pickup', {
                    lat: -23.550520,
                    lng: -46.633308,
                    address: e.target.value
                  });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destino
              </label>
              <input
                type="text"
                placeholder="Digite o endereço de destino"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  // Mock location selection
                  handleLocationSelect('destination', {
                    lat: -23.555520,
                    lng: -46.638308,
                    address: e.target.value
                  });
                }}
              />
            </div>
          </div>

          {/* Price Estimate */}
          {pickup && destination && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Estimativa</h3>
              <div className="space-y-2">
                <p className="text-blue-800">
                  Distância: {distance.toFixed(2)} km
                </p>
                <p className="text-blue-800 text-lg font-semibold">
                  Valor Estimado: R$ {estimatedPrice.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleRequestRide}
            disabled={!pickup || !destination}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 ${
              (!pickup || !destination) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Solicitar Motorista
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pagamento</h3>
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  value="4242 4242 4242 4242"
                  readOnly
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validade
                  </label>
                  <input
                    type="text"
                    value="12/25"
                    readOnly
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    value="123"
                    readOnly
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Estimado</span>
                  <span className="font-medium">R$ {estimatedPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500">
                  O valor final pode variar de acordo com o trajeto realizado
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processando...' : 'Confirmar Pagamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PassengerRequest;