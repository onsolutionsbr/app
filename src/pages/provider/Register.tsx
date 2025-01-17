import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
  rg: string;
  address: string;
  category: string;
  cities: string[];
  description: string;
  languages: string[];
  documents: {
    cpf: File | null;
    rg: File | null;
    proofOfAddress: File | null;
    professionalCertification: File | null;
  };
}

function ProviderRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    cpf: '',
    rg: '',
    address: '',
    category: '',
    cities: [],
    description: '',
    languages: [],
    documents: {
      cpf: null,
      rg: null,
      proofOfAddress: null,
      professionalCertification: null
    }
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: files[0]
        }
      }));
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const city = e.target.value;
    setFormData(prev => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter(c => c !== city)
        : [...prev.cities, city]
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const language = e.target.value;
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    
    try {
      // Here we'll implement the registration logic
      // For now, just show success message and redirect
      toast.success('Cadastro enviado para aprovação!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error('Erro ao enviar cadastro');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Cadastro de Profissional
          </h2>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`flex items-center ${
                    item < step ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${
                      item <= step
                        ? 'border-blue-600 text-blue-600'
                        : 'border-gray-400'
                    }`}
                  >
                    {item}
                  </div>
                  {item < 4 && (
                    <div
                      className={`h-1 w-12 mx-2 ${
                        item < step ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Dados Pessoais</span>
              <span className="text-sm">Documentos</span>
              <span className="text-sm">Área de Atuação</span>
              <span className="text-sm">Qualificações</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    RG
                  </label>
                  <input
                    type="text"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CPF (foto/scan)
                  </label>
                  <input
                    type="file"
                    name="cpf"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                    accept="image/*,.pdf"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    RG (foto/scan)
                  </label>
                  <input
                    type="file"
                    name="rg"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                    accept="image/*,.pdf"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Comprovante de Residência
                  </label>
                  <input
                    type="file"
                    name="proofOfAddress"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                    accept="image/*,.pdf"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Certificação Profissional
                  </label>
                  <input
                    type="file"
                    name="professionalCertification"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                    accept="image/*,.pdf"
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoria de Serviço
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="tourist">Guia Turístico</option>
                    <option value="legal">Advogado</option>
                    <option value="medical">Médico</option>
                    <option value="transport">Transporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidades de Atuação
                  </label>
                  <div className="space-y-2">
                    {['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Recife'].map((city) => (
                      <label key={city} className="flex items-center">
                        <input
                          type="checkbox"
                          value={city}
                          checked={formData.cities.includes(city)}
                          onChange={handleCityChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição dos Serviços
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Descreva sua experiência e os serviços que oferece..."
                    required
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idiomas
                  </label>
                  <div className="space-y-2">
                    {['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão'].map((language) => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          value={language}
                          checked={formData.languages.includes(language)}
                          onChange={handleLanguageChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Seu cadastro passará por análise antes de ser aprovado. Você receberá um email com o resultado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Voltar
                </button>
              )}
              <button
                type="submit"
                className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {step === 4 ? 'Enviar Cadastro' : 'Próximo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProviderRegister;