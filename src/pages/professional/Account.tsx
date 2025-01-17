import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ProviderAccount {
  name: string;
  email: string;
  phone: string;
  cities: string[];
  balance: {
    available: number;
    pending: number;
    total: number;
  };
  bankInfo: {
    bank: string;
    agency: string;
    account: string;
  };
}

function Account() {
  const [account, setAccount] = useState<ProviderAccount>({
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '(11) 99999-9999',
    cities: ['São Paulo', 'Guarulhos'],
    balance: {
      available: 960.00, // 80% of completed services
      pending: 240.00,   // Pending payments
      total: 1200.00     // Total earnings
    },
    bankInfo: {
      bank: 'Banco do Brasil',
      agency: '1234-5',
      account: '12345-6'
    }
  });

  const [editing, setEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState(account);

  const handleSave = () => {
    setAccount(editedAccount);
    setEditing(false);
    toast.success('Dados atualizados com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Minha Conta</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-blue-600 hover:text-blue-800"
              >
                {editing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {/* Balance Information */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Saldo Disponível</h3>
                <p className="mt-2 text-2xl font-semibold text-green-900">
                  R$ {account.balance.available.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-green-600">
                  Pronto para saque
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800">Saldo Pendente</h3>
                <p className="mt-2 text-2xl font-semibold text-yellow-900">
                  R$ {account.balance.pending.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-yellow-600">
                  Em processamento
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Total Ganho</h3>
                <p className="mt-2 text-2xl font-semibold text-blue-900">
                  R$ {account.balance.total.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-blue-600">
                  Valor bruto
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.name : account.name}
                      onChange={(e) => setEditedAccount({ ...editedAccount, name: e.target.value })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={editing ? editedAccount.email : account.email}
                      onChange={(e) => setEditedAccount({ ...editedAccount, email: e.target.value })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                      type="tel"
                      value={editing ? editedAccount.phone : account.phone}
                      onChange={(e) => setEditedAccount({ ...editedAccount, phone: e.target.value })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cities */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cidades de Atuação</h3>
                <div className="space-y-2">
                  {editing ? (
                    <div className="grid grid-cols-3 gap-2">
                      {['São Paulo', 'Guarulhos', 'Campinas', 'Santos', 'São Bernardo', 'Santo André'].map((city) => (
                        <label key={city} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editedAccount.cities.includes(city)}
                            onChange={(e) => {
                              const cities = e.target.checked
                                ? [...editedAccount.cities, city]
                                : editedAccount.cities.filter(c => c !== city);
                              setEditedAccount({ ...editedAccount, cities });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{city}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {account.cities.map((city) => (
                        <span
                          key={city}
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Bancários</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Banco</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.bankInfo.bank : account.bankInfo.bank}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        bankInfo: { ...editedAccount.bankInfo, bank: e.target.value }
                      })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agência</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.bankInfo.agency : account.bankInfo.agency}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        bankInfo: { ...editedAccount.bankInfo, agency: e.target.value }
                      })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Conta</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.bankInfo.account : account.bankInfo.account}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        bankInfo: { ...editedAccount.bankInfo, account: e.target.value }
                      })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;