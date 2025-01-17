import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface UserAccount {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

function Account() {
  const [account, setAccount] = useState<UserAccount>({
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98888-8888',
    city: 'São Paulo',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.city : account.city}
                      onChange={(e) => setEditedAccount({ ...editedAccount, city: e.target.value })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Rua</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.address.street : account.address.street}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        address: { ...editedAccount.address, street: e.target.value }
                      })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.address.number : account.address.number}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        address: { ...editedAccount.address, number: e.target.value }
                      })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Complemento</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.address.complement : account.address.complement}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        address: { ...editedAccount.address, complement: e.target.value }
                      })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bairro</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.address.neighborhood : account.address.neighborhood}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        address: { ...editedAccount.address, neighborhood: e.target.value }
                      })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CEP</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.address.zipCode : account.address.zipCode}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        address: { ...editedAccount.address, zipCode: e.target.value }
                      })}
                      disabled={!editing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <input
                      type="text"
                      value={editing ? editedAccount.address.state : account.address.state}
                      onChange={(e) => setEditedAccount({
                        ...editedAccount,
                        address: { ...editedAccount.address, state: e.target.value }
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