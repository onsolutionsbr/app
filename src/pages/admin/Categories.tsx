import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface RequiredField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'file' | 'checkbox';
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
}

interface LocationType {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  serviceType: 'remote' | 'inPerson' | 'both';
  requiredFields: RequiredField[];
  locationTypes: string[];
  active: boolean;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'cat_tourist',
      name: 'Guia Turístico',
      icon: '🏛️',
      description: 'Guias profissionais para sua viagem',
      serviceType: 'inPerson',
      requiredFields: [
        {
          id: 'cpf',
          name: 'CPF',
          type: 'text',
          required: true,
          validation: {
            pattern: '\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}',
            message: 'CPF inválido'
          }
        },
        {
          id: 'rg',
          name: 'RG',
          type: 'text',
          required: true
        },
        {
          id: 'address',
          name: 'Endereço Completo',
          type: 'text',
          required: true
        },
        {
          id: 'experience',
          name: 'Anos de Experiência',
          type: 'number',
          required: true,
          validation: {
            minLength: 0,
            maxLength: 50,
            message: 'Valor inválido'
          }
        },
        {
          id: 'languages',
          name: 'Idiomas',
          type: 'select',
          required: true,
          options: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão']
        }
      ],
      locationTypes: ['museum', 'historical', 'park'],
      active: true
    }
  ]);

  const [locationTypes, setLocationTypes] = useState<LocationType[]>([
    {
      id: 'museum',
      name: 'Museus',
      description: 'Museus e galerias de arte',
      active: true
    },
    {
      id: 'historical',
      name: 'Centros Históricos',
      description: 'Locais históricos e patrimônios culturais',
      active: true
    },
    {
      id: 'park',
      name: 'Parques',
      description: 'Parques e áreas naturais',
      active: true
    }
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddLocationType, setShowAddLocationType] = useState(false);
  const [showEditFields, setShowEditFields] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    icon: '',
    description: '',
    serviceType: 'both',
    requiredFields: [],
    locationTypes: []
  });

  const [newLocationType, setNewLocationType] = useState<Partial<LocationType>>({
    name: '',
    description: ''
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.icon || !newCategory.description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const id = 'cat_' + newCategory.name.toLowerCase().replace(/\s+/g, '_');
    
    setCategories([
      ...categories,
      {
        id,
        name: newCategory.name,
        icon: newCategory.icon,
        description: newCategory.description,
        serviceType: newCategory.serviceType || 'both',
        requiredFields: newCategory.requiredFields || [],
        locationTypes: newCategory.locationTypes || [],
        active: true
      }
    ]);

    setNewCategory({
      name: '',
      icon: '',
      description: '',
      serviceType: 'both',
      requiredFields: [],
      locationTypes: []
    });
    setShowAddCategory(false);
    toast.success('Categoria adicionada com sucesso!');
  };

  const handleAddLocationType = () => {
    if (!newLocationType.name || !newLocationType.description) {
      toast.error('Preencha todos os campos');
      return;
    }

    const id = newLocationType.name.toLowerCase().replace(/\s+/g, '_');
    
    setLocationTypes([
      ...locationTypes,
      {
        id,
        name: newLocationType.name,
        description: newLocationType.description,
        active: true
      }
    ]);

    setNewLocationType({ name: '', description: '' });
    setShowAddLocationType(false);
    toast.success('Tipo de local adicionado com sucesso!');
  };

  const handleEditFields = (category: Category) => {
    setSelectedCategory(category);
    setShowEditFields(true);
  };

  const handleSaveFields = (fields: RequiredField[]) => {
    if (!selectedCategory) return;

    setCategories(categories.map(cat =>
      cat.id === selectedCategory.id
        ? { ...cat, requiredFields: fields }
        : cat
    ));

    setShowEditFields(false);
    setSelectedCategory(null);
    toast.success('Campos atualizados com sucesso!');
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, active: !cat.active } : cat
    ));
    toast.success('Status da categoria atualizado!');
  };

  const toggleLocationTypeStatus = (id: string) => {
    setLocationTypes(types =>
      types.map(type =>
        type.id === id ? { ...type, active: !type.active } : type
      )
    );
    toast.success('Status do tipo de local atualizado!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Categorias e Locais</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddLocationType(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Adicionar Tipo de Local
          </button>
          <button
            onClick={() => setShowAddCategory(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Adicionar Categoria
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categorias de Serviço</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{category.icon}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category.active}
                    onChange={() => toggleCategoryStatus(category.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
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
              <div className="space-y-2">
                <button
                  onClick={() => handleEditFields(category)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Editar Campos Obrigatórios ({category.requiredFields.length})
                </button>
                <div className="flex flex-wrap gap-2">
                  {category.locationTypes.map((typeId) => {
                    const locationType = locationTypes.find(t => t.id === typeId);
                    return locationType ? (
                      <span
                        key={typeId}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {locationType.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Types List */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tipos de Local</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locationTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">{type.name}</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={type.active}
                    onChange={() => toggleLocationTypeStatus(type.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <p className="text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Nova Categoria</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ícone (emoji)
                </label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ex: 🏛️"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Serviço
                </label>
                <select
                  value={newCategory.serviceType}
                  onChange={(e) => setNewCategory({ ...newCategory, serviceType: e.target.value as Category['serviceType'] })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="both">Remoto e Presencial</option>
                  <option value="remote">Apenas Remoto</option>
                  <option value="inPerson">Apenas Presencial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipos de Local Disponíveis
                </label>
                <div className="space-y-2">
                  {locationTypes.map((type) => (
                    <label key={type.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCategory.locationTypes?.includes(type.id)}
                        onChange={(e) => {
                          const types = e.target.checked
                            ? [...(newCategory.locationTypes || []), type.id]
                            : (newCategory.locationTypes || []).filter(id => id !== type.id);
                          setNewCategory({ ...newCategory, locationTypes: types });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Location Type Modal */}
      {showAddLocationType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Novo Tipo de Local</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={newLocationType.name}
                  onChange={(e) => setNewLocationType({ ...newLocationType, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newLocationType.description}
                  onChange={(e) => setNewLocationType({ ...newLocationType, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddLocationType(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLocationType}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fields Modal */}
      {showEditFields && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              Editar Campos Obrigatórios - {selectedCategory.name}
            </h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedCategory.requiredFields.map((field, index) => (
                <div key={field.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Campo
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => {
                          const updatedFields = [...selectedCategory.requiredFields];
                          updatedFields[index] = { ...field, name: e.target.value };
                          setSelectedCategory({ ...selectedCategory, requiredFields: updatedFields });
                        }}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const updatedFields = [...selectedCategory.requiredFields];
                          updatedFields[index] = { ...field, type: e.target.value as RequiredField['type'] };
                          setSelectedCategory({ ...selectedCategory, requiredFields: updatedFields });
                        }}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="date">Data</option>
                        <option value="select">Seleção</option>
                        <option value="file">Arquivo</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          const updatedFields = [...selectedCategory.requiredFields];
                          updatedFields[index] = { ...field, required: e.target.checked };
                          setSelectedCategory({ ...selectedCategory, requiredFields: updatedFields });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Campo Obrigatório</span>
                    </label>
                  </div>

                  {field.type === 'select' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opções (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={field.options?.join(', ') || ''}
                        onChange={(e) => {
                          const updatedFields = [...selectedCategory.requiredFields];
                          updatedFields[index] = {
                            ...field,
                            options: e.target.value.split(',').map(opt => opt.trim())
                          };
                          setSelectedCategory({ ...selectedCategory, requiredFields: updatedFields });
                        }}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  )}

                  {(field.type === 'text' || field.type === 'number') && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Validação (Regex ou Min/Max)
                        </label>
                        <input
                          type="text"
                          value={field.validation?.pattern || ''}
                          onChange={(e) => {
                            const updatedFields = [...selectedCategory.requiredFields];
                            updatedFields[index] = {
                              ...field,
                              validation: { ...field.validation, pattern: e.target.value }
                            };
                            setSelectedCategory({ ...selectedCategory, requiredFields: updatedFields });
                          }}
                          className="w-full border border-gray-300 rounded-md p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mensagem de Erro
                        </label>
                        <input
                          type="text"
                          value={field.validation?.message || ''}
                          onChange={(e) => {
                            const updatedFields = [...selectedCategory.requiredFields];
                            updatedFields[index] = {
                              ...field,
                              validation: { ...field.validation, message: e.target.value }
                            };
                            setSelectedCategory({ ...selectedCategory, requiredFields: updatedFields });
                          }}
                          className="w-full border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const updatedFields = selectedCategory.requiredFields.filter((_, i) => i !== index);
                      setSelectedCategory({ ...selectedCategory, requiredFields: updatedFields });
                    }}
                    className="mt-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remover Campo
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  const newField: RequiredField = {
                    id: `field_${Date.now()}`,
                    name: '',
                    type: 'text',
                    required: true
                  };
                  setSelectedCategory({
                    ...selectedCategory,
                    requiredFields: [...selectedCategory.requiredFields, newField]
                  });
                }}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
              >
                + Adicionar Campo
              </button>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditFields(false);
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveFields(selectedCategory.requiredFields)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Salvar Campos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;