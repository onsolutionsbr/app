import React from 'react';
import { format } from 'date-fns';

interface Refund {
  id: string;
  serviceId: string;
  clientName: string;
  providerName: string;
  amount: number;
  providerPenalty: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  reason: string;
}

interface RefundsListProps {
  refunds: Refund[];
  onApprove: (refundId: string) => void;
  onReject: (refundId: string) => void;
}

function RefundsList({ refunds, onApprove, onReject }: RefundsListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Reembolsos Pendentes</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID do Serviço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profissional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Penalidade (10%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data da Solicitação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {refunds.map((refund) => (
              <tr key={refund.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{refund.serviceId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {refund.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {refund.providerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {refund.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  R$ {refund.providerPenalty.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(refund.requestDate, 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    refund.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : refund.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {refund.status === 'pending' ? 'Pendente' : 
                     refund.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {refund.status === 'pending' && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onApprove(refund.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => onReject(refund.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RefundsList;