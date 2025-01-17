import { Application } from '@nativescript/core';
import { initializeFirebase } from './services/firebase.service';

// Initialize Firebase before starting the app
initializeFirebase();

Application.run({ moduleName: 'app-root' });