import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

function UserSettings() {
  const [autoApprove, setAutoApprove] = useState(false);
  const [pendingProviders, setPendingProviders] = useState([
    {
      id: 'prov_1',
      name: 'João Silva',
      email: 'joao@example.com',
      category: 'Guia Turístico',
      submittedAt: new Date(),
      documents: [
        { name: 'CPF', verified: false },
        { name: 'RG', verified: false },
        { name: 'Comprovante de Residência', verified: false },
        { name: 'Certificação Profissional', verified: false }
      ]
    },
    {
      id: 'prov_2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      category: 'Advogado',
      submittedAt: new Date(),
      documents: [
        { name: 'CPF', verified: false },
        { name: 'RG', verified: false },
        { name: 'Comprovante de Residência', verified: false },
        { name: 'OAB', verified: false }
      ]
    }
  ]);

  const handleToggleAutoApprove = () => {
    setAutoApprove(!autoApprove);
    toast.success(`Aprovação automática ${!autoApprove ? 'ativada' : 'desativada'}`);
  };

  const handleApproveProvider = (providerId: string) => {
    setPendingProviders(providers =>
      providers.filter(provider => provider.id !== providerId)
    );
    toast.success('Profissional aprovado com sucesso!');
  };

  const handleRejectProvider = (providerId: string) => {
    setPendingProviders(providers =>
      providers.filter(provider => provider.id !== providerId)
    );
    toast.success('Profissional rejeitado');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações de Usuário</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Aprovação Automática</h3>
              <p className="text-gray-500 mt-1">
                Quando ativada, novos profissionais serão aprovados automaticamente
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={handleToggleAutoApprove}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profissionais Pendentes</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Submissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documentos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingProviders.map((provider) => (
                <tr key={provider.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                    <div className="text-sm text-gray-500">{provider.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {provider.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {provider.submittedAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {provider.documents.map((doc, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.verified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {doc.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleApproveProvider(provider.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleRejectProvider(provider.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Rejeitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;