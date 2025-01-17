import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface RatingModalProps {
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  serviceType: string;
  providerName: string;
}

function RatingModal({ onClose, onSubmit, serviceType, providerName }: RatingModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Avaliar {serviceType}</h3>
        <p className="text-gray-600 mb-4">
          Como foi sua experiência com {providerName}?
        </p>
        
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-3xl focus:outline-none transition-transform hover:scale-110"
              >
                {star <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deixe um comentário sobre sua experiência..."
            className="w-full border border-gray-300 rounded-md p-2 h-32 focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enviar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;