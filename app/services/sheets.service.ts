import { google } from 'googleapis';
import { Observable } from '@nativescript/core';
import { getApplicationSettings, setApplicationSettings } from '@nativescript/core/application-settings';

export class SheetsService extends Observable {
    private static instance: SheetsService;
    private auth: any;
    private sheets: any;
    private spreadsheetId: string = '';

    private constructor() {
        super();
        this.initializeGoogleSheets();
    }

    public static getInstance(): SheetsService {
        if (!SheetsService.instance) {
            SheetsService.instance = new SheetsService();
        }
        return SheetsService.instance;
    }

    private async initializeGoogleSheets() {
        try {
            const credentials = this.getStoredCredentials();
            if (!credentials) {
                throw new Error('Google Sheets credentials not found');
            }

            this.auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });

            this.sheets = google.sheets({ version: 'v4', auth: this.auth });
            this.spreadsheetId = this.getSpreadsheetId();
        } catch (error) {
            console.error('Error initializing Google Sheets:', error);
        }
    }

    private getStoredCredentials() {
        return getApplicationSettings().getString('googleCredentials', '');
    }

    private getSpreadsheetId() {
        return getApplicationSettings().getString('spreadsheetId', '');
    }

    public async setSpreadsheetId(spreadsheetId: string) {
        this.spreadsheetId = spreadsheetId;
        setApplicationSettings('spreadsheetId', spreadsheetId);
    }

    public async validateSpreadsheet(): Promise<boolean> {
        try {
            await this.sheets.spreadsheets.get({
                spreadsheetId: this.spreadsheetId
            });
            return true;
        } catch (error) {
            console.error('Error validating spreadsheet:', error);
            return false;
        }
    }

    public async ensureSheetStructure() {
        const sheets = [
            {
                name: 'Clientes',
                headers: ['Nome', 'Email', 'Telefone', 'Data de Cadastro']
            },
            {
                name: 'Profissionais',
                headers: ['Nome', 'Categoria', 'Preço', 'Descrição', 'Disponibilidade']
            },
            {
                name: 'Serviços',
                headers: ['ID Serviço', 'Cliente', 'Profissional', 'Data', 'Valor']
            },
            {
                name: 'Transações',
                headers: ['ID Transação', 'Valor', 'Data', 'Status']
            }
        ];

        for (const sheet of sheets) {
            await this.createSheetIfNotExists(sheet.name, sheet.headers);
        }
    }

    private async createSheetIfNotExists(sheetName: string, headers: string[]) {
        try {
            const response = await this.sheets.spreadsheets.get({
                spreadsheetId: this.spreadsheetId
            });

            const existingSheet = response.data.sheets.find(
                (s: any) => s.properties.title === sheetName
            );

            if (!existingSheet) {
                await this.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: this.spreadsheetId,
                    requestBody: {
                        requests: [
                            {
                                addSheet: {
                                    properties: {
                                        title: sheetName
                                    }
                                }
                            }
                        ]
                    }
                });

                await this.sheets.spreadsheets.values.update({
                    spreadsheetId: this.spreadsheetId,
                    range: `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
                    valueInputOption: 'RAW',
                    requestBody: {
                        values: [headers]
                    }
                });
            }
        } catch (error) {
            console.error(`Error creating sheet ${sheetName}:`, error);
        }
    }

    public async addRow(sheetName: string, values: any[]) {
        try {
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: `${sheetName}!A1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [values]
                }
            });
        } catch (error) {
            console.error('Error adding row:', error);
            throw error;
        }
    }

    public async getRows(sheetName: string): Promise<any[]> {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: sheetName
            });
            return response.data.values || [];
        } catch (error) {
            console.error('Error getting rows:', error);
            throw error;
        }
    }

    public async updateRow(sheetName: string, rowIndex: number, values: any[]) {
        try {
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: `${sheetName}!A${rowIndex}`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [values]
                }
            });
        } catch (error) {
            console.error('Error updating row:', error);
            throw error;
        }
    }
}