import React, { useState } from 'react';
import { format } from 'date-fns';

interface Service {
  id: string;
  clientName: string;
  providerName: string;
  serviceType: string;
  status: 'pending' | 'in_progress' | 'scheduled' | 'completed' | 'cancelled';
  scheduledDate?: Date;
  startTime?: Date;
  endTime?: Date;
  price: number;
}

interface ServiceMonitoringProps {
  services: Service[];
  onViewDetails: (serviceId: string) => void;
}

function ServiceMonitoring({ services, onViewDetails }: ServiceMonitoringProps) {
  const [selectedStatus, setSelectedStatus] = useState<Service['status'] | 'all'>('all');

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Service['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'scheduled':
        return 'Agendado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredServices = services.filter(service => 
    selectedStatus === 'all' || service.status === selectedStatus
  );

  const handleStatusClick = (status: Service['status'] | 'all') => {
    setSelectedStatus(status === selectedStatus ? 'all' : status);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Monitoramento de Serviços</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusClick('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            {['pending', 'in_progress', 'scheduled', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusClick(status as Service['status'])}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedStatus === status
                    ? getStatusColor(status as Service['status']).replace('100', '500').replace('800', '100')
                    : getStatusColor(status as Service['status'])
                } hover:opacity-80`}
              >
                {getStatusText(status as Service['status'])}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profissional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{service.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {service.clientName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {service.providerName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.serviceType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.scheduledDate ? (
                    format(service.scheduledDate, 'dd/MM/yyyy HH:mm')
                  ) : service.startTime ? (
                    format(service.startTime, 'dd/MM/yyyy HH:mm')
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {service.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(service.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServiceMonitoring;