import React, { useState } from 'react';
import SupportChatList from '../../components/admin/SupportChatList';
import ChatWindow from '../../components/admin/ChatWindow';

// Mock data - replace with real data from your backend
const mockChats = [
  {
    id: 'chat_1',
    serviceId: 'srv_1',
    userId: 'user_1',
    userName: 'João Silva',
    userPhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'Preciso de ajuda com o serviço',
    timestamp: new Date(),
    unread: true,
    serviceStatus: 'in_progress',
    serviceType: 'Guia Turístico'
  },
  {
    id: 'chat_2',
    serviceId: 'srv_2',
    userId: 'user_2',
    userName: 'Maria Oliveira',
    userPhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: 'Como faço para cancelar?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    unread: false,
    serviceStatus: 'scheduled',
    serviceType: 'Consulta Jurídica'
  },
];

const mockMessages = {
  chat_1: [
    {
      id: 'msg_1',
      content: 'Olá, preciso de ajuda com o serviço de Guia Turístico',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'msg_2',
      content: 'Claro! Como posso ajudar?',
      sender: 'admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 29),
    },
  ],
  chat_2: [
    {
      id: 'msg_3',
      content: 'Como faço para cancelar minha Consulta Jurídica?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
  ],
} as Record<string, Array<{ id: string; content: string; sender: 'user' | 'admin'; timestamp: Date; }>>;

function Support() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [chats, setChats] = useState(mockChats);
  const [messages, setMessages] = useState(mockMessages);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // Mark chat as read
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, unread: false } : chat
    ));
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChatId) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      content,
      sender: 'admin' as const,
      timestamp: new Date(),
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
    }));

    // Update last message in chat list
    setChats(chats.map(chat =>
      chat.id === selectedChatId
        ? { ...chat, lastMessage: content, timestamp: new Date() }
        : chat
    ));
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <div className="h-[calc(100vh-64px)] flex">
      <SupportChatList
        chats={chats}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
      />
      {selectedChat ? (
        <ChatWindow
          chatId={selectedChat.id}
          serviceId={selectedChat.serviceId}
          userName={selectedChat.userName}
          userPhoto={selectedChat.userPhoto}
          serviceType={selectedChat.serviceType}
          serviceStatus={selectedChat.serviceStatus}
          messages={messages[selectedChat.id] || []}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Selecione um chat para iniciar o atendimento</p>
        </div>
      )}
    </div>
  );
}

export default Support;