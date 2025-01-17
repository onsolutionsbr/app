import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  date: Date;
  slots: TimeSlot[];
}

function BookService() {
  const { categoryId, providerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDays, setAvailableDays] = useState<DaySchedule[]>([]);

  useEffect(() => {
    // Mock data - In production, fetch from provider's availability
    const generateMockSchedule = () => {
      const days: DaySchedule[] = [];
      const today = startOfDay(new Date());

      for (let i = 0; i < 14; i++) {
        const date = addDays(today, i);
        const slots: TimeSlot[] = [];

        // Generate slots from 8:00 to 18:00
        for (let hour = 8; hour < 18; hour++) {
          slots.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: Math.random() > 0.3 // 70% chance of being available
          });
        }

        days.push({ date, slots });
      }

      return days;
    };

    setAvailableDays(generateMockSchedule());
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Por favor, selecione data e horário');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful payment, navigate to active service page
      navigate('/services/active', {
        state: {
          serviceId: 'srv_' + Date.now(),
          providerId,
          categoryId,
          status: 'confirmed',
          scheduledDate: selectedDate,
          scheduledTime: selectedTime
        }
      });
      
      toast.success('Pagamento confirmado com sucesso!');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Agendar Serviço</h2>
          
          {/* Date Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selecione a Data</h3>
            <div className="grid grid-cols-7 gap-2">
              {availableDays.map(({ date, slots }) => {
                const hasAvailableSlots = slots.some(slot => slot.available);
                const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
                const isPast = isBefore(date, startOfDay(new Date()));

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => hasAvailableSlots && !isPast && handleDateSelect(date)}
                    disabled={!hasAvailableSlots || isPast}
                    className={`p-3 rounded-lg text-center ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isPast
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : hasAvailableSlots
                        ? 'hover:bg-blue-50 border border-gray-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="block text-xs mb-1">
                      {format(date, 'EEE', { locale: ptBR })}
                    </span>
                    <span className="block font-semibold">
                      {format(date, 'd')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Selecione o Horário</h3>
              <div className="grid grid-cols-4 gap-2">
                {availableDays
                  .find(day => day.date.getTime() === selectedDate.getTime())
                  ?.slots.map(({ time, available }) => (
                    <button
                      key={time}
                      onClick={() => available && handleTimeSelect(time)}
                      disabled={!available}
                      className={`p-2 rounded-lg text-center ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : available
                          ? 'hover:bg-blue-50 border border-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Selected Date/Time Summary */}
          {selectedDate && selectedTime && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Horário Selecionado</h4>
              <p className="text-blue-800">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTime}
              </p>
            </div>
          )}

          {/* Price Summary */}
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-medium">R$ 150,00</span>
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
              onClick={handleProceedToPayment}
              disabled={!selectedDate || !selectedTime}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                (!selectedDate || !selectedTime) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Prosseguir para Pagamento
            </button>
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
                  <span className="font-medium">R$ 150,00</span>
                </div>
                <p className="text-sm text-gray-500">
                  Agendado para {format(selectedDate!, "dd 'de' MMMM", { locale: ptBR })} às {selectedTime}
                </p>
              </div>

              <button
                onClick={handlePayment}
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

export default BookService;