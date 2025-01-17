import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  event: 'booking_confirmation' | 'service_started' | 'service_completed' | 'payment_received' | 'refund_processed';
}

function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'smtp' | 'templates'>('api');
  const [spreadsheetLink, setSpreadsheetLink] = useState('');
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [smtpSettings, setSmtpSettings] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    fromEmail: '',
    fromName: ''
  });
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 'booking_confirmation',
      name: 'Confirmação de Agendamento',
      subject: 'Seu agendamento foi confirmado',
      body: `Olá {clientName},

Seu agendamento foi confirmado com sucesso!

Detalhes do serviço:
- Profissional: {providerName}
- Data: {serviceDate}
- Horário: {serviceTime}
- Tipo: {serviceType}

Valor total: R$ {amount}

Atenciosamente,
Equipe Braziliana`,
      variables: ['clientName', 'providerName', 'serviceDate', 'serviceTime', 'serviceType', 'amount'],
      event: 'booking_confirmation'
    },
    {
      id: 'service_started',
      name: 'Serviço Iniciado',
      subject: 'Seu serviço foi iniciado',
      body: `Olá {clientName},

Seu serviço foi iniciado com o profissional {providerName}.

Código de finalização: {completionCode}

Atenciosamente,
Equipe Braziliana`,
      variables: ['clientName', 'providerName', 'completionCode'],
      event: 'service_started'
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Store settings in localStorage for now
      localStorage.setItem('settings', JSON.stringify({
        spreadsheetLink,
        stripePublicKey,
        stripeSecretKey,
        supabaseUrl,
        supabaseAnonKey,
        smtp: smtpSettings,
        emailTemplates: templates
      }));

      setMessageType('success');
      setMessage('Configurações salvas com sucesso!');
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      setMessageType('error');
      setMessage(`Erro ao salvar configurações: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Erro ao salvar configurações');
    }
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSaveTemplate = () => {
    if (!selectedTemplate) return;

    setTemplates(prevTemplates =>
      prevTemplates.map(t =>
        t.id === selectedTemplate.id ? selectedTemplate : t
      )
    );
    setSelectedTemplate(null);
    toast.success('Template atualizado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('api')}
                  className={`${
                    activeTab === 'api'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  APIs
                </button>
                <button
                  onClick={() => setActiveTab('smtp')}
                  className={`${
                    activeTab === 'smtp'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  SMTP
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`${
                    activeTab === 'templates'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  Templates de Email
                </button>
              </nav>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Google Sheets Configuration</h3>
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Spreadsheet Link
                        </label>
                        <input
                          type="text"
                          value={spreadsheetLink}
                          onChange={(e) => setSpreadsheetLink(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Paste Google Sheets link here"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Stripe API</h3>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Public Key
                          </label>
                          <input
                            type="text"
                            value={stripePublicKey}
                            onChange={(e) => setStripePublicKey(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Secret Key
                          </label>
                          <input
                            type="password"
                            value={stripeSecretKey}
                            onChange={(e) => setStripeSecretKey(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Supabase Configuration</h3>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Project URL
                          </label>
                          <input
                            type="text"
                            value={supabaseUrl}
                            onChange={(e) => setSupabaseUrl(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="https://your-project.supabase.co"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Anon Key
                          </label>
                          <input
                            type="password"
                            value={supabaseAnonKey}
                            onChange={(e) => setSupabaseAnonKey(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'smtp' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">SMTP Configuration</h3>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            SMTP Host
                          </label>
                          <input
                            type="text"
                            value={smtpSettings.host}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="smtp.example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            SMTP Port
                          </label>
                          <input
                            type="text"
                            value={smtpSettings.port}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="587"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Username
                          </label>
                          <input
                            type="text"
                            value={smtpSettings.username}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <input
                            type="password"
                            value={smtpSettings.password}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            From Email
                          </label>
                          <input
                            type="email"
                            value={smtpSettings.fromEmail}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, fromEmail: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="noreply@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            From Name
                          </label>
                          <input
                            type="text"
                            value={smtpSettings.fromName}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, fromName: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Braziliana"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'templates' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {templates.map((template) => (
                        <div key={template.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                              <p className="text-sm text-gray-500 mt-1">Evento: {template.event}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEditTemplate(template)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Editar
                            </button>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700">Assunto:</p>
                            <p className="text-sm text-gray-600">{template.subject}</p>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Variáveis disponíveis:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {template.variables.map((variable) => (
                                <span
                                  key={variable}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {variable}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {message && (
                  <div className={`mt-4 p-4 rounded ${
                    messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Salvar Configurações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Template Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              Editar Template - {selectedTemplate.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  value={selectedTemplate.subject}
                  onChange={(e) => setSelectedTemplate({
                    ...selectedTemplate,
                    subject: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corpo do Email
                </label>
                <textarea
                  value={selectedTemplate.body}
                  onChange={(e) => setSelectedTemplate({
                    ...selectedTemplate,
                    body: e.target.value
                  })}
                  rows={10}
                  className="w-full border border-gray-300 rounded-md p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variáveis Disponíveis
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable) => (
                    <span
                      key={variable}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Salvar Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;