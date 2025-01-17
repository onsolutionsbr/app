import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'cat_tourist',
    name: 'Guia Turístico',
    icon: '🏛️',
    description: 'Guias profissionais para sua viagem',
    serviceType: 'inPerson',
    features: ['Roteiros personalizados', 'Guias multilíngues', 'Conhecimento local']
  },
  {
    id: 'cat_legal',
    name: 'Advogados',
    icon: '⚖️',
    description: 'Consultoria jurídica especializada',
    serviceType: 'remote',
    features: ['Primeira consulta grátis', 'Atendimento 24/7', 'Especialistas em diversas áreas']
  },
  {
    id: 'cat_medical',
    name: 'Médicos',
    icon: '👨‍⚕️',
    description: 'Atendimento médico domiciliar',
    serviceType: 'both',
    features: ['Consultas em casa', 'Atendimento de urgência', 'Diversas especialidades']
  },
  {
    id: 'cat_transport',
    name: 'Transporte',
    icon: '🚗',
    description: 'Transporte particular de passageiros',
    serviceType: 'inPerson',
    features: ['Motoristas verificados', 'Carros confortáveis', 'Preços justos']
  }
];

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">Braziliana</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/register"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Criar Conta
            </Link>
            <Link
              to="/register/provider"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Seja um Profissional
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Entrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Encontre os Melhores Profissionais
            </h2>
            <p className="mt-4 text-xl">
              Serviços de qualidade com profissionais verificados e avaliados
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="#services"
                className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100"
              >
                Ver Serviços
              </a>
              <Link
                to="/mobility/request"
                className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600"
              >
                Solicitar Corrida
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Nossos Serviços
        </h3>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.id === 'cat_transport' ? '/mobility/request' : `/services/category/${category.id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{category.name}</h4>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.serviceType === 'remote' ? 'bg-purple-100 text-purple-800' :
                    category.serviceType === 'inPerson' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {category.serviceType === 'remote' ? 'Remoto' :
                     category.serviceType === 'inPerson' ? 'Presencial' :
                     'Remoto e Presencial'}
                  </span>
                </div>
                <ul className="space-y-2">
                  {category.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                  {category.id === 'cat_transport' ? 'Solicitar corrida' : 'Ver profissionais'} →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            Como Funciona
          </h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2">Escolha o Serviço</h4>
              <p className="text-gray-600">
                Selecione o tipo de serviço e encontre profissionais qualificados
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2">Agende ou Solicite</h4>
              <p className="text-gray-600">
                Escolha entre atendimento imediato ou agende para uma data específica
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2">Pagamento Seguro</h4>
              <p className="text-gray-600">
                Pague com segurança e avalie o serviço após a conclusão
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            © 2024 Braziliana. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;