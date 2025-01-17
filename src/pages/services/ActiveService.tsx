import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Map from '../../components/Map';
import SupportChat from '../../components/SupportChat';
import SplitView from '../../components/SplitView';
import RemoteProviderView from '../../components/RemoteProviderView';
import InPersonProviderView from '../../components/InPersonProviderView';

interface LocationState {
  serviceId: string;
  status: string;
  provider: {
    id: string;
    name: string;
    rating: number;
    totalRatings: number;
    photo: string;
  };
  client: {
    name: string;
    photo: string;
  };
  serviceType: 'remote' | 'inPerson';
}

function ActiveService() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [status, setStatus] = useState<'arriving' | 'arrived' | 'in_progress' | 'completed'>('arriving');
  const [completionCode] = useState('1234'); // Fixed completion code for testing

  // Video call refs and state
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isVideoConnected, setIsVideoConnected] = useState(false);

  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.serviceId || !state?.provider || !state?.client) {
      toast.error('Informações do serviço não encontradas');
      navigate('/');
      return;
    }
  }, [state, navigate]);

  if (!state?.serviceId || !state?.provider || !state?.client) {
    return null;
  }

  const initializeVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };
      
      peerConnectionRef.current = new RTCPeerConnection(configuration);

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream);
        }
      });

      // Handle incoming stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      setIsVideoConnected(true);
      setStatus('in_progress');
      toast.success('Chamada de vídeo iniciada!');
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Erro ao acessar câmera e microfone');
    }
  };

  const handleProviderArrival = () => {
    setStatus('arrived');
    toast.success('Profissional chegou ao local!');
  };

  const handleStartService = () => {
    setStatus('in_progress');
    toast.success('Serviço iniciado!');
  };

  const handleCompleteService = (code: string) => {
    if (code !== completionCode) {
      toast.error('Código de finalização inválido');
      return;
    }

    // Stop video call if it's a remote service
    if (state.serviceType === 'remote') {
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      setIsVideoConnected(false);
    }

    setStatus('completed');
    toast.success('Serviço finalizado com sucesso!');
    setTimeout(() => navigate('/'), 2000);
  };

  const ClientView = (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Provider Info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <img
                src={state.provider.photo}
                alt={state.provider.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{state.provider.name}</h3>
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(state.provider.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">({state.provider.totalRatings} avaliações)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Interface for Remote Services */}
          {state.serviceType === 'remote' && (
            <div className="p-6 border-b">
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
                    {state.provider.name}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                {!isVideoConnected ? (
                  <button
                    onClick={initializeVideoCall}
                    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Conectar
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus('in_progress')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                  >
                    Iniciar Atendimento
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Map for In-Person Services */}
          {state.serviceType === 'inPerson' && status === 'arriving' && (
            <div className="p-6 border-b">
              <Map
                origin={{ lat: -23.550520, lng: -46.633308 }}
                destination={{ lat: -23.555520, lng: -46.638308 }}
                providerLocation={{ lat: -23.552520, lng: -46.635308 }}
              />
            </div>
          )}

          {/* Status */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {state.serviceType === 'remote' ? (
                  !isVideoConnected ? 'Aguardando conexão' :
                  status === 'in_progress' ? 'Em atendimento' :
                  status === 'completed' ? 'Finalizado' : 'Conectando...'
                ) : (
                  status === 'arriving' ? 'Profissional a caminho' :
                  status === 'arrived' ? 'Profissional no local' :
                  status === 'in_progress' ? 'Em andamento' :
                  'Finalizado'
                )}
              </span>
            </div>

            {/* Completion Code Display */}
            {status === 'in_progress' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Código de Finalização
                </h4>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold tracking-wider text-blue-800 bg-white px-4 py-2 rounded-lg border-2 border-blue-200">
                    {completionCode}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-2 text-center">
                  Forneça este código ao profissional para finalizar o serviço
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              {state.serviceType === 'inPerson' && status === 'arrived' && (
                <button
                  onClick={handleStartService}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Confirmar Início do Serviço
                </button>
              )}

              <button
                onClick={() => setShowSupportChat(true)}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Problemas? Contatar Suporte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Chat Modal */}
      {showSupportChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg h-[600px]">
            <SupportChat
              onClose={() => setShowSupportChat(false)}
              serviceId={state.serviceId}
            />
          </div>
        </div>
      )}
    </div>
  );

  const ProviderView = state.serviceType === 'remote' ? (
    <RemoteProviderView
      provider={{
        name: state.provider.name,
        rating: state.provider.rating,
        totalRatings: state.provider.totalRatings,
        profileImage: state.provider.photo
      }}
      client={state.client}
      status={status}
      onConnect={initializeVideoCall}
      onComplete={handleCompleteService}
      localVideoRef={localVideoRef}
      remoteVideoRef={remoteVideoRef}
      isVideoConnected={isVideoConnected}
    />
  ) : (
    <InPersonProviderView
      provider={{
        name: state.provider.name,
        rating: state.provider.rating,
        totalRatings: state.provider.totalRatings,
        profileImage: state.provider.photo
      }}
      client={state.client}
      status={status}
      onArrival={handleProviderArrival}
      onComplete={handleCompleteService}
    />
  );

  return (
    <SplitView
      clientView={ClientView}
      providerView={ProviderView}
    />
  );
}

export default ActiveService;