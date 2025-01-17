import React from 'react';
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
  description?: string;
  location?: string;
}

interface ServiceDetailsProps {
  service: Service;
  onClose: () => void;
  onCancel: (serviceId: string) => void;
  onComplete: (serviceId: string) => void;
  onRequestRefund: (serviceId: string) => void;
}

function ServiceDetails({
  service,
  onClose,
  onCancel,
  onComplete,
  onRequestRefund,
}: ServiceDetailsProps) {
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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">
              Detalhes do Serviço #{service.id}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Fechar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                <p className="mt-1 text-lg text-gray-900">{service.clientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Profissional</h3>
                <p className="mt-1 text-lg text-gray-900">{service.providerName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tipo de Serviço</h3>
                <p className="mt-1 text-lg text-gray-900">{service.serviceType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-1 inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(service.status)}`}>
                  {getStatusText(service.status)}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data/Hora</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {service.scheduledDate
                    ? format(service.scheduledDate, 'dd/MM/yyyy HH:mm')
                    : service.startTime
                    ? format(service.startTime, 'dd/MM/yyyy HH:mm')
                    : '-'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Valor</h3>
                <p className="mt-1 text-lg text-gray-900">
                  R$ {service.price.toFixed(2)}
                </p>
              </div>
            </div>

            {service.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                <p className="mt-1 text-gray-900">{service.description}</p>
              </div>
            )}

            {service.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Local</h3>
                <p className="mt-1 text-gray-900">{service.location}</p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                {service.status !== 'completed' && service.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={() => onComplete(service.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Concluir
                    </button>
                    <button
                      onClick={() => onCancel(service.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {(service.status === 'completed' || service.status === 'cancelled') && (
                  <button
                    onClick={() => onRequestRefund(service.id)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                  >
                    Solicitar Reembolso
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;