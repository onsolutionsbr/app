import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import SupportChat from './SupportChat';

interface ProviderViewProps {
  provider: {
    name: string;
    rating: number;
    totalRatings: number;
    profileImage: string;
  };
  client: {
    name: string;
    photo: string;
  };
  status: 'arriving' | 'arrived' | 'in_progress' | 'completed';
  serviceType: 'remote' | 'inPerson';
  onArrival: () => void;
  onComplete: (code: string) => void;
  localVideoRef?: React.RefObject<HTMLVideoElement>;
  remoteVideoRef?: React.RefObject<HTMLVideoElement>;
  isVideoConnected?: boolean;
}

function ProviderView({ 
  provider, 
  client, 
  status, 
  serviceType,
  onArrival, 
  onComplete,
  localVideoRef,
  remoteVideoRef,
  isVideoConnected
}: ProviderViewProps) {
  const [completionCode, setCompletionCode] = useState('');
  const [showSupportChat, setShowSupportChat] = useState(false);

  const handleComplete = () => {
    if (completionCode.length !== 4) {
      toast.error('O código deve ter 4 dígitos');
      return;
    }
    onComplete(completionCode);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-4">Painel do Profissional</h2>
        <div className="flex justify-center space-x-8">
          <div>
            <img
              src={provider.profileImage}
              alt={provider.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">{provider.name}</h3>
            <div className="flex items-center justify-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(provider.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div>
            <img
              src={client.photo}
              alt={client.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">{client.name}</h3>
            <p className="text-gray-600">Cliente</p>
          </div>
        </div>
      </div>

      {/* Video Interface for Remote Services */}
      {serviceType === 'remote' && (
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-[300px] rounded-lg bg-black object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                Você
              </span>
            </div>
            <div className="relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-[300px] rounded-lg bg-black object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {client.name}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Status do Serviço</h4>
          <p className="text-blue-600">{
            status === 'arriving' ? 'A caminho do local' :
            status === 'arrived' ? 'No local' :
            status === 'in_progress' ? 'Em andamento' :
            'Finalizado'
          }</p>
        </div>

        {serviceType === 'remote' ? (
          <button
            onClick={onArrival}
            disabled={isVideoConnected}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ${
              isVideoConnected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isVideoConnected ? 'Conectado' : 'Conectar'}
          </button>
        ) : (
          status === 'arriving' && (
            <button
              onClick={onArrival}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Confirmar Chegada ao Local
            </button>
          )
        )}

        {status === 'in_progress' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Finalização
              </label>
              <input
                type="text"
                maxLength={4}
                value={completionCode}
                onChange={(e) => setCompletionCode(e.target.value.replace(/\D/g, ''))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o código de 4 dígitos"
              />
            </div>
            <button
              onClick={handleComplete}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {serviceType === 'remote' ? 'Encerrar Chamada' : 'Finalizar Serviço'}
            </button>
          </div>
        )}

        <button
          onClick={() => setShowSupportChat(true)}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
        >
          Contatar Suporte
        </button>
      </div>

      {/* Support Chat Modal */}
      {showSupportChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg h-[600px]">
            <SupportChat
              onClose={() => setShowSupportChat(false)}
              serviceId="123"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderView;