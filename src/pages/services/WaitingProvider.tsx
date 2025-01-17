import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SplitView from '../../components/SplitView';

interface LocationState {
  categoryId: string;
  details: {
    type: 'remote' | 'inPerson';
    serviceLocation?: string;
    locationDetails?: string;
    subject?: string;
    description: string;
    hours: number;
    country?: string;
    state?: string;
    city?: string;
  };
  requestId: string;
  status: string;
}

function WaitingProvider() {
  const location = useLocation();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [searching, setSearching] = useState(true);
  const [providerAccepted, setProviderAccepted] = useState(false);
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.requestId) {
      navigate('/');
      return;
    }

    // Simulate finding a provider
    const timer = setTimeout(() => {
      setProvider({
        id: 'prov_1',
        name: 'Maria Silva',
        rating: 4.8,
        totalRatings: 156,
        photo: 'https://randomuser.me/api/portraits/women/1.jpg'
      });
      setSearching(false);
      toast.success('Profissional encontrado!');
    }, 5000);

    return () => clearTimeout(timer);
  }, [state, navigate]);

  const handleProviderAccept = () => {
    setProviderAccepted(true);
    toast.success(state.details.type === 'remote' 
      ? 'Serviço aceito! Preparando chamada de vídeo...'
      : 'Serviço aceito! Iniciando deslocamento...'
    );
    
    setTimeout(() => {
      navigate('/services/active', {
        state: {
          serviceId: state.requestId,
          status: 'arriving',
          provider,
          client: {
            name: 'João Silva',
            photo: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          serviceType: state.details.type
        },
        replace: true
      });
    }, 1000);
  };

  const handleCancel = () => {
    if (window.confirm('Deseja realmente cancelar a solicitação?')) {
      navigate('/');
    }
  };

  const ClientView = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {searching ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="text-xl font-semibold mt-6 mb-2">
                Procurando profissionais...
              </h2>
              <p className="text-gray-600 mb-6">
                Aguarde enquanto encontramos o melhor profissional para você
              </p>
            </>
          ) : provider && !providerAccepted ? (
            <>
              <img
                src={provider.photo}
                alt={provider.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{provider.name}</h2>
              <div className="flex items-center justify-center text-yellow-400 mb-4">
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
                <span className="ml-2 text-gray-600">({provider.totalRatings} avaliações)</span>
              </div>
              <p className="text-gray-600 mb-6">
                Aguardando confirmação do profissional...
              </p>
            </>
          ) : (
            <>
              <div className="animate-pulse">
                <div className="h-16 w-16 bg-blue-600 rounded-full mx-auto"></div>
                <h2 className="text-xl font-semibold mt-6 mb-2">
                  Profissional aceitou o serviço!
                </h2>
                <p className="text-gray-600 mb-6">
                  {state.details.type === 'remote' 
                    ? 'Preparando chamada de vídeo...'
                    : 'Profissional a caminho...'}
                </p>
              </div>
            </>
          )}
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-800"
            disabled={providerAccepted}
          >
            Cancelar solicitação
          </button>
        </div>
      </div>
    </div>
  );

  const ProviderView = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Nova solicitação de serviço</h2>
          
          {provider && !searching ? (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Detalhes do Serviço</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Tipo: {state.details.type === 'remote' ? 'Remoto' : 'Presencial'}</p>
                  <p>Duração: {state.details.hours} hora(s)</p>
                  <p>Valor: R$ {(150 * state.details.hours).toFixed(2)}</p>
                  
                  {state.details.type === 'remote' ? (
                    <p>Assunto: {state.details.subject}</p>
                  ) : (
                    <>
                      <p>Local: {state.details.serviceLocation}</p>
                      <p>Cidade: {state.details.city}, {state.details.state}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleProviderAccept}
                  disabled={providerAccepted}
                  className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
                    ${providerAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {providerAccepted 
                    ? 'Serviço aceito!' 
                    : state.details.type === 'remote'
                      ? 'Conectar'
                      : 'Aceitar Serviço'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={providerAccepted}
                  className={`w-full border border-red-600 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 
                    ${providerAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Recusar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>Aguardando solicitações...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!state?.requestId) {
    return null;
  }

  return (
    <SplitView
      clientView={ClientView}
      providerView={ProviderView}
    />
  );
}

export default WaitingProvider;