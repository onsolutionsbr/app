import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Payment {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  serviceId: string;
  amount: number;
  platformFee: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
  paidAt?: Date;
}

interface PaymentHistory {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  serviceId: string;
  amount: number;
  platformFee: number;
  paidAt: Date;
}

function Payments() {
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([
    {
      id: 'pay_1',
      providerId: 'prov_1',
      providerName: 'Maria Silva',
      providerEmail: 'maria@example.com',
      serviceId: 'srv_1',
      amount: 150.00,
      platformFee: 30.00, // 20% fee
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000) // Yesterday
    },
    {
      id: 'pay_2',
      providerId: 'prov_2',
      providerName: 'João Santos',
      providerEmail: 'joao@example.com',
      serviceId: 'srv_2',
      amount: 300.00,
      platformFee: 60.00,
      status: 'pending',
      createdAt: new Date(Date.now() - 172800000) // 2 days ago
    }
  ]);

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: 'pay_3',
      providerId: 'prov_1',
      providerName: 'Maria Silva',
      providerEmail: 'maria@example.com',
      serviceId: 'srv_3',
      amount: 200.00,
      platformFee: 40.00,
      paidAt: new Date(Date.now() - 259200000) // 3 days ago
    }
  ]);

  // Filter states
  const [searchEmail, setSearchEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    email: '',
    startDate: '',
    endDate: ''
  });

  const filterPayments = (items: Payment[] | PaymentHistory[]) => {
    return items.filter(payment => {
      const matchesEmail = appliedFilters.email 
        ? payment.providerEmail.toLowerCase().includes(appliedFilters.email.toLowerCase())
        : true;
      
      const paymentDate = 'paidAt' in payment ? payment.paidAt : payment.createdAt;
      const matchesStartDate = appliedFilters.startDate 
        ? new Date(paymentDate) >= new Date(appliedFilters.startDate)
        : true;
      const matchesEndDate = appliedFilters.endDate 
        ? new Date(paymentDate) <= new Date(appliedFilters.endDate)
        : true;

      return matchesEmail && matchesStartDate && matchesEndDate;
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      email: searchEmail,
      startDate,
      endDate
    });
    toast.success('Filtros aplicados');
  };

  const handleClearFilters = () => {
    setSearchEmail('');
    setStartDate('');
    setEndDate('');
    setAppliedFilters({
      email: '',
      startDate: '',
      endDate: ''
    });
    toast.success('Filtros limpos');
  };

  const handleMarkAsPaid = (paymentId: string) => {
    const payment = pendingPayments.find(p => p.id === paymentId);
    if (!payment) return;

    // Move to history
    const historyEntry: PaymentHistory = {
      id: payment.id,
      providerId: payment.providerId,
      providerName: payment.providerName,
      providerEmail: payment.providerEmail,
      serviceId: payment.serviceId,
      amount: payment.amount,
      platformFee: payment.platformFee,
      paidAt: new Date()
    };

    setPaymentHistory([historyEntry, ...paymentHistory]);
    setPendingPayments(payments => payments.filter(p => p.id !== paymentId));
    toast.success('Pagamento marcado como realizado');
  };

  const handleMarkAsPending = (paymentId: string) => {
    const payment = paymentHistory.find(p => p.id === paymentId);
    if (!payment) return;

    // Move back to pending
    const pendingEntry: Payment = {
      id: payment.id,
      providerId: payment.providerId,
      providerName: payment.providerName,
      providerEmail: payment.providerEmail,
      serviceId: payment.serviceId,
      amount: payment.amount,
      platformFee: payment.platformFee,
      status: 'pending',
      createdAt: new Date()
    };

    setPendingPayments([pendingEntry, ...pendingPayments]);
    setPaymentHistory(history => history.filter(p => p.id !== paymentId));
    toast.success('Pagamento movido para pendentes');
  };

  const handleDelete = (paymentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pagamento?')) {
      setPendingPayments(payments => payments.filter(p => p.id !== paymentId));
      toast.success('Pagamento excluído');
    }
  };

  const filteredPendingPayments = filterPayments(pendingPayments);
  const filteredPaymentHistory = filterPayments(paymentHistory);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Pagamentos</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email do Profissional
            </label>
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Buscar por email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Limpar Filtros
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pagamentos Pendentes</h3>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profissional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa (20%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Líquido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPendingPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.providerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.providerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{payment.serviceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    R$ {payment.platformFee.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    R$ {(payment.amount - payment.platformFee).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(payment.createdAt, 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleMarkAsPaid(payment.id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Pago
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Pagamentos</h3>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profissional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa (20%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data do Pagamento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPaymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.providerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.providerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{payment.serviceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    R$ {payment.platformFee.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    R$ {(payment.amount - payment.platformFee).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(payment.paidAt, 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleMarkAsPending(payment.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Mover para Pendentes
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

export default Payments;