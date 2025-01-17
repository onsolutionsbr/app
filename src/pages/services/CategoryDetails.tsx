import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SheetsService } from '../../services/sheets.service';
import toast from 'react-hot-toast';

function CategoryDetails() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingService, setRequestingService] = useState(false);

  useEffect(() => {
    async function loadProviders() {
      if (categoryId) {
        const sheetsService = SheetsService.getInstance();
        const data = await sheetsService.getProviders(categoryId);
        setProviders(data);
        setLoading(false);
      }
    }
    loadProviders();
  }, [categoryId]);

  const handleImmediateRequest = async () => {
    navigate(`/services/request/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Immediate Request Button */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Atendimento Imediato</h2>
          <p className="text-gray-600 mb-4">
            Solicite atendimento agora e conecte-se com o primeiro profissional disponível.
          </p>
          <button
            onClick={handleImmediateRequest}
            disabled={requestingService}
            className={`w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors ${
              requestingService ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {requestingService ? 'Processando...' : 'Solicitar Agora'}
          </button>
        </div>

        {/* Provider List for Scheduling */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Agendar para Depois
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={provider.profileImage}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-xl font-semibold text-white">
                    {provider.name}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(provider.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({provider.totalRatings} avaliações)
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{provider.description}</p>
                <p className="text-gray-800 font-semibold mb-4">
                  R$ {provider.price.toFixed(2)}/hora
                </p>
                <button
                  onClick={() => navigate(`/services/book/${categoryId}/${provider.id}?type=scheduled`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetails;