import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

interface ChatWindowProps {
  chatId: string;
  serviceId: string;
  userName: string;
  userPhoto: string;
  serviceType: string;
  serviceStatus: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

function ChatWindow({
  chatId,
  serviceId,
  userName,
  userPhoto,
  serviceType,
  serviceStatus,
  messages,
  onSendMessage
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <img
          src={userPhoto}
          alt={userName}
          className="h-10 w-10 rounded-full"
        />
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">{userName}</h3>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500">Serviço #{serviceId}</p>
            <span className="text-sm text-gray-400">•</span>
            <p className="text-sm text-gray-500">{serviceType}</p>
            <span className="text-sm text-gray-400">•</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              serviceStatus === 'in_progress'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {serviceStatus === 'in_progress' ? 'Em Andamento' : 'Agendado'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {format(message.timestamp, 'HH:mm')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;