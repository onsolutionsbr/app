import { Observable } from '@nativescript/core';
import { auth } from '../../services/firebase.service';

export class LoginViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private _errorMessage: string = '';

    constructor() {
        super();
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        if (this._errorMessage !== value) {
            this._errorMessage = value;
            this.notifyPropertyChange('errorMessage', value);
        }
    }

    async onLogin() {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(this.email, this.password);
            // Navigate to appropriate dashboard based on user type
            console.log('User logged in:', userCredential.user.uid);
        } catch (error) {
            this.errorMessage = error.message;
        }
    }

    onSignUp() {
        // Navigate to sign up page
    }

    async onGoogleLogin() {
        try {
            // Implement Google login
        } catch (error) {
            this.errorMessage = error.message;
        }
    }

    async onFacebookLogin() {
        try {
            // Implement Facebook login
        } catch (error) {
            this.errorMessage = error.message;
        }
    }
}