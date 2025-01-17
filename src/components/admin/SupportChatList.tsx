import React from 'react';
import { format } from 'date-fns';

interface Chat {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  serviceStatus: string;
  serviceType: string;
}

interface SupportChatListProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
}

function SupportChatList({ chats, onSelectChat, selectedChatId }: SupportChatListProps) {
  return (
    <div className="border-r border-gray-200 w-80 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Atendimentos</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left p-4 hover:bg-gray-50 focus:outline-none ${
              selectedChatId === chat.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={chat.userPhoto}
                alt={chat.userName}
                className="h-10 w-10 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(chat.timestamp, 'HH:mm')}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  Serviço #{chat.serviceId} - {chat.serviceType}
                </p>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread && (
                <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-blue-600">
                  <span className="sr-only">Unread messages</span>
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SupportChatList;