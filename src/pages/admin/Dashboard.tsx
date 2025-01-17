import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Support from './Support';
import ServiceMonitoring from '../../components/admin/ServiceMonitoring';
import ServiceDetails from '../../components/admin/ServiceDetails';
import RefundsList from '../../components/admin/RefundsList';
import Categories from './Categories';
import Payments from './Payments';
import { toast } from 'react-hot-toast';

// Mock services data
const mockServices = [
  {
    id: 'srv_1',
    clientName: 'João Silva',
    providerName: 'Maria Oliveira',
    serviceType: 'Guia Turístico',
    status: 'in_progress' as const,
    startTime: new Date(),
    price: 150.00,
    description: 'Tour pelo centro histórico',
    location: 'Centro, São Paulo'
  },
  {
    id: 'srv_2',
    clientName: 'Ana Santos',
    providerName: 'Pedro Costa',
    serviceType: 'Consulta Jurídica',
    status: 'scheduled' as const,
    scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
    price: 300.00
  },
  {
    id: 'srv_3',
    clientName: 'Carlos Ferreira',
    providerName: 'Julia Lima',
    serviceType: 'Atendimento Médico',
    status: 'completed' as const,
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(),
    price: 250.00
  }
];

// Mock refunds data
const mockRefunds = [
  {
    id: 'ref_1',
    serviceId: 'srv_5',
    clientName: 'Paulo Mendes',
    providerName: 'Carla Santos',
    amount: 150.00,
    providerPenalty: 15.00,
    status: 'pending' as const,
    requestDate: new Date(),
    reason: 'Serviço cancelado pelo cliente'
  }
];

function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState(mockServices);
  const [refunds, setRefunds] = useState(mockRefunds);
  const [selectedService, setSelectedService] = useState<typeof mockServices[0] | null>(null);

  const handleViewServiceDetails = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
    }
  };

  const handleCloseServiceDetails = () => {
    setSelectedService(null);
  };

  const handleCancelService = (serviceId: string) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, status: 'cancelled' as const }
        : service
    ));
    setSelectedService(null);
    toast.success('Serviço cancelado com sucesso');
  };

  const handleCompleteService = (serviceId: string) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, status: 'completed' as const }
        : service
    ));
    setSelectedService(null);
    toast.success('Serviço concluído com sucesso');
  };

  const handleRequestRefund = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const newRefund = {
        id: `ref_${Date.now()}`,
        serviceId: service.id,
        clientName: service.clientName,
        providerName: service.providerName,
        amount: service.price,
        providerPenalty: service.price * 0.1,
        status: 'pending' as const,
        requestDate: new Date(),
        reason: 'Solicitação de reembolso'
      };
      setRefunds([...refunds, newRefund]);
      setSelectedService(null);
      setActiveTab('refunds');
      toast.success('Solicitação de reembolso criada com sucesso');
    }
  };

  const handleApproveRefund = (refundId: string) => {
    setRefunds(refunds.map(refund =>
      refund.id === refundId
        ? { ...refund, status: 'approved' as const }
        : refund
    ));
    toast.success('Reembolso aprovado com sucesso');
  };

  const handleRejectRefund = (refundId: string) => {
    setRefunds(refunds.map(refund =>
      refund.id === refundId
        ? { ...refund, status: 'rejected' as const }
        : refund
    ));
    toast.success('Reembolso rejeitado');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('services')}
              className={`${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Serviços
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Categorias
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`${
                activeTab === 'support'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Suporte
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`${
                activeTab === 'refunds'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Reembolsos
              {refunds.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  {refunds.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pagamentos
            </button>
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="mt-6">
          {activeTab === 'services' && (
            <ServiceMonitoring
              services={services}
              onViewDetails={handleViewServiceDetails}
            />
          )}
          {activeTab === 'categories' && <Categories />}
          {activeTab === 'support' && <Support />}
          {activeTab === 'refunds' && (
            <RefundsList
              refunds={refunds}
              onApprove={handleApproveRefund}
              onReject={handleRejectRefund}
            />
          )}
          {activeTab === 'payments' && <Payments />}
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetails
          service={selectedService}
          onClose={handleCloseServiceDetails}
          onCancel={handleCancelService}
          onComplete={handleCompleteService}
          onRequestRefund={handleRequestRefund}
        />
      )}
    </div>
  );
}

export default AdminDashboard;