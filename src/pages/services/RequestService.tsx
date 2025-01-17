import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface ServiceDetails {
  type: 'remote' | 'inPerson';
  serviceLocation?: string;
  locationDetails?: string;
  subject?: string;
  description: string;
  hours: number;
  country?: string;
  state?: string;
  city?: string;
}

// Category-specific fields and options
const categoryConfig = {
  cat_tourist: {
    type: 'inPerson',
    locationTypes: [
      { id: 'museum', name: 'Museus' },
      { id: 'historical', name: 'Centros Históricos' },
      { id: 'park', name: 'Parques' }
    ]
  },
  cat_legal: {
    type: 'remote',
    subjects: [
      'Direito Civil',
      'Direito Trabalhista',
      'Direito do Consumidor',
      'Direito Empresarial'
    ]
  },
  cat_medical: {
    type: 'both',
    subjects: [
      'Consulta Geral',
      'Acompanhamento',
      'Segunda Opinião',
      'Emergência'
    ],
    locationTypes: [
      { id: 'home', name: 'Residência' },
      { id: 'clinic', name: 'Clínica' },
      { id: 'hospital', name: 'Hospital' }
    ]
  }
};

function RequestService() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [details, setDetails] = useState<ServiceDetails>({
    type: categoryConfig[categoryId as keyof typeof categoryConfig]?.type || 'inPerson',
    description: '',
    hours: 1
  });

  // Get category configuration
  const config = categoryConfig[categoryId as keyof typeof categoryConfig];

  const handlePayment = () => {
    if (details.type === 'inPerson') {
      if (!details.country || !details.state || !details.city || !details.serviceLocation) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }
    } else {
      if (!details.subject) {
        toast.error('Por favor, informe o assunto da consulta');
        return;
      }
    }
    setShowPayment(true);
  };

  const handleCompleteService = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const requestId = 'req_' + Date.now();
      
      navigate('/services/waiting', {
        state: {
          categoryId,
          details,
          requestId,
          status: 'pending'
        },
        replace: true
      });
      
      setShowPayment(false);
      toast.success('Pagamento confirmado! Buscando profissional...');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
      setLoading(false);
    }
  };

  if (!config) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Detalhes do Serviço</h2>
          
          <div className="space-y-6">
            {/* Service Type Selection - Only show if category supports both types */}
            {config.type === 'both' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Atendimento
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDetails({ ...details, type: 'remote' })}
                    className={`p-4 rounded-lg border-2 text-center ${
                      details.type === 'remote'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-2xl mb-2">💻</span>
                    Remoto
                  </button>
                  <button
                    onClick={() => setDetails({ ...details, type: 'inPerson' })}
                    className={`p-4 rounded-lg border-2 text-center ${
                      details.type === 'inPerson'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-2xl mb-2">🏥</span>
                    Presencial
                  </button>
                </div>
              </div>
            )}

            {/* Remote Service Fields */}
            {details.type === 'remote' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto da Consulta
                </label>
                <select
                  value={details.subject || ''}
                  onChange={(e) => setDetails({ ...details, subject: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione o assunto</option>
                  {config.subjects?.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* In-Person Service Fields */}
            {details.type === 'inPerson' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local do Atendimento
                </label>
                <select
                  value={details.serviceLocation || ''}
                  onChange={(e) => setDetails({ ...details, serviceLocation: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione o local</option>
                  {config.locationTypes?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={details.city || ''}
                      onChange={(e) => setDetails({ ...details, city: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite a cidade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={details.state || ''}
                      onChange={(e) => setDetails({ ...details, state: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite o estado"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração (horas)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={details.hours}
                onChange={(e) => setDetails({ ...details, hours: parseInt(e.target.value) })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {details.type === 'remote' ? 'Detalhes da Consulta' : 'Observações Adicionais'}
              </label>
              <textarea
                value={details.description}
                onChange={(e) => setDetails({ ...details, description: e.target.value })}
                rows={4}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder={details.type === 'remote' 
                  ? "Descreva sua necessidade em detalhes..."
                  : "Informações adicionais importantes..."}
              />
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">R$ {(150 * details.hours).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Pagar e Solicitar
              </button>
            </div>
          </div>
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
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">R$ {(150 * details.hours).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCompleteService}
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

export default RequestService;