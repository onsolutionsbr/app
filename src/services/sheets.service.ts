import { google } from 'googleapis';

export class SheetsService {
  private static instance: SheetsService;
  private spreadsheetId: string = '1shaVmgnjqPbFplCDDYKYUFe5lwo1ebssLSdbSBmrdSY';

  private constructor() {}

  public static getInstance(): SheetsService {
    if (!SheetsService.instance) {
      SheetsService.instance = new SheetsService();
    }
    return SheetsService.instance;
  }

  public async getProviders(categoryId: string): Promise<any[]> {
    // Mock data for tourist guides with complete information
    const providers = {
      cat_tourist: [
        {
          id: 'sp_1',
          name: 'Maria Silva',
          rating: 4.8,
          totalRatings: 156,
          price: 150.00,
          description: 'Guia turística especializada em história e cultura local',
          profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
          languages: ['Português', 'Inglês', 'Espanhol'],
          specialties: ['Centros Históricos', 'Museus', 'Gastronomia'],
          availability: [
            {
              dayOfWeek: 1, // Monday
              slots: [
                { time: '09:00', available: true },
                { time: '11:00', available: true },
                { time: '14:00', available: true },
                { time: '16:00', available: true }
              ]
            },
            {
              dayOfWeek: 2, // Tuesday
              slots: [
                { time: '09:00', available: true },
                { time: '11:00', available: true },
                { time: '14:00', available: true },
                { time: '16:00', available: true }
              ]
            },
            {
              dayOfWeek: 3, // Wednesday
              slots: [
                { time: '09:00', available: true },
                { time: '11:00', available: true },
                { time: '14:00', available: true },
                { time: '16:00', available: true }
              ]
            }
          ]
        },
        {
          id: 'sp_5',
          name: 'João Oliveira',
          rating: 4.9,
          totalRatings: 203,
          price: 180.00,
          description: 'Especialista em turismo de aventura e ecoturismo',
          profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
          languages: ['Português', 'Inglês', 'Francês'],
          specialties: ['Trilhas', 'Parques Naturais', 'Fotografia'],
          availability: [
            {
              dayOfWeek: 1,
              slots: [
                { time: '08:00', available: true },
                { time: '10:00', available: true },
                { time: '13:00', available: true },
                { time: '15:00', available: true }
              ]
            },
            {
              dayOfWeek: 2,
              slots: [
                { time: '08:00', available: true },
                { time: '10:00', available: true },
                { time: '13:00', available: true },
                { time: '15:00', available: true }
              ]
            }
          ]
        }
      ],
      cat_legal: [
        {
          id: 'sp_2',
          name: 'João Santos',
          rating: 4.9,
          totalRatings: 243,
          price: 300.00,
          description: 'Advogado especializado em direito civil e trabalhista',
          profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
        }
      ],
      cat_medical: [
        {
          id: 'sp_3',
          name: 'Ana Oliveira',
          rating: 4.7,
          totalRatings: 89,
          price: 250.00,
          description: 'Médica clínica geral com atendimento domiciliar',
          profileImage: 'https://randomuser.me/api/portraits/women/4.jpg'
        }
      ],
      cat_transport: [
        {
          id: 'sp_4',
          name: 'Pedro Costa',
          rating: 4.6,
          totalRatings: 567,
          price: 80.00,
          description: 'Motorista profissional com mais de 10 anos de experiência',
          profileImage: 'https://randomuser.me/api/portraits/men/5.jpg'
        }
      ]
    };

    return providers[categoryId as keyof typeof providers] || [];
  }

  public async getCategories(): Promise<any[]> {
    return [
      {
        id: 'cat_tourist',
        name: 'Guia Turístico',
        icon: '🏛️',
        description: 'Guias profissionais para sua viagem'
      },
      {
        id: 'cat_legal',
        name: 'Advogados',
        icon: '⚖️',
        description: 'Consultoria jurídica especializada'
      },
      {
        id: 'cat_medical',
        name: 'Médicos',
        icon: '👨‍⚕️',
        description: 'Atendimento médico domiciliar'
      },
      {
        id: 'cat_transport',
        name: 'Transporte',
        icon: '🚗',
        description: 'Transporte particular de passageiros'
      }
    ];
  }
}