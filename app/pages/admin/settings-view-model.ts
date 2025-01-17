import { Observable } from '@nativescript/core';
import { SheetsService } from '../../services/sheets.service';
import { getApplicationSettings, setApplicationSettings } from '@nativescript/core/application-settings';

export class SettingsViewModel extends Observable {
    private _spreadsheetLink: string = '';
    private _stripePublicKey: string = '';
    private _stripeSecretKey: string = '';
    private _firebaseProjectId: string = '';
    private _firebaseApiKey: string = '';
    private _firebaseAuthDomain: string = '';
    private _message: string = '';
    private _messageType: 'success' | 'error' = 'success';

    constructor() {
        super();
        this.loadStoredSettings();
    }

    private loadStoredSettings() {
        this.spreadsheetLink = getApplicationSettings().getString('spreadsheetLink', '');
        this.stripePublicKey = getApplicationSettings().getString('stripePublicKey', '');
        this.stripeSecretKey = getApplicationSettings().getString('stripeSecretKey', '');
        this.firebaseProjectId = getApplicationSettings().getString('firebaseProjectId', '');
        this.firebaseApiKey = getApplicationSettings().getString('firebaseApiKey', '');
        this.firebaseAuthDomain = getApplicationSettings().getString('firebaseAuthDomain', '');
    }

    get spreadsheetLink(): string {
        return this._spreadsheetLink;
    }

    set spreadsheetLink(value: string) {
        if (this._spreadsheetLink !== value) {
            this._spreadsheetLink = value;
            this.notifyPropertyChange('spreadsheetLink', value);
        }
    }

    get stripePublicKey(): string {
        return this._stripePublicKey;
    }

    set stripePublicKey(value: string) {
        if (this._stripePublicKey !== value) {
            this._stripePublicKey = value;
            this.notifyPropertyChange('stripePublicKey', value);
        }
    }

    get stripeSecretKey(): string {
        return this._stripeSecretKey;
    }

    set stripeSecretKey(value: string) {
        if (this._stripeSecretKey !== value) {
            this._stripeSecretKey = value;
            this.notifyPropertyChange('stripeSecretKey', value);
        }
    }

    get firebaseProjectId(): string {
        return this._firebaseProjectId;
    }

    set firebaseProjectId(value: string) {
        if (this._firebaseProjectId !== value) {
            this._firebaseProjectId = value;
            this.notifyPropertyChange('firebaseProjectId', value);
        }
    }

    get firebaseApiKey(): string {
        return this._firebaseApiKey;
    }

    set firebaseApiKey(value: string) {
        if (this._firebaseApiKey !== value) {
            this._firebaseApiKey = value;
            this.notifyPropertyChange('firebaseApiKey', value);
        }
    }

    get firebaseAuthDomain(): string {
        return this._firebaseAuthDomain;
    }

    set firebaseAuthDomain(value: string) {
        if (this._firebaseAuthDomain !== value) {
            this._firebaseAuthDomain = value;
            this.notifyPropertyChange('firebaseAuthDomain', value);
        }
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange('message', value);
        }
    }

    get messageType(): 'success' | 'error' {
        return this._messageType;
    }

    set messageType(value: 'success' | 'error') {
        if (this._messageType !== value) {
            this._messageType = value;
            this.notifyPropertyChange('messageType', value);
        }
    }

    async onSaveSettings() {
        try {
            // Extract spreadsheet ID from link
            const spreadsheetId = this.extractSpreadsheetId(this.spreadsheetLink);
            if (!spreadsheetId) {
                throw new Error('Link da planilha inválido');
            }

            // Save all settings
            setApplicationSettings('spreadsheetLink', this.spreadsheetLink);
            setApplicationSettings('spreadsheetId', spreadsheetId);
            setApplicationSettings('stripePublicKey', this.stripePublicKey);
            setApplicationSettings('stripeSecretKey', this.stripeSecretKey);
            setApplicationSettings('firebaseProjectId', this.firebaseProjectId);
            setApplicationSettings('firebaseApiKey', this.firebaseApiKey);
            setApplicationSettings('firebaseAuthDomain', this.firebaseAuthDomain);

            // Initialize and validate Google Sheets
            const sheetsService = SheetsService.getInstance();
            await sheetsService.setSpreadsheetId(spreadsheetId);
            const isValid = await sheetsService.validateSpreadsheet();

            if (!isValid) {
                throw new Error('Não foi possível acessar a planilha. Verifique as permissões.');
            }

            // Create initial structure if needed
            await sheetsService.ensureSheetStructure();

            this.messageType = 'success';
            this.message = 'Configurações salvas com sucesso!';
        } catch (error) {
            this.messageType = 'error';
            this.message = `Erro ao salvar: ${error.message}`;
        }
    }

    private extractSpreadsheetId(link: string): string | null {
        const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
        const match = link.match(regex);
        return match ? match[1] : null;
    }
}