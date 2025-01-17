import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import '@nativescript/firebase-firestore';

export function initializeFirebase() {
    firebase().initializeApp({})
        .then(() => {
            console.log("Firebase initialized successfully");
        })
        .catch(error => {
            console.error("Error initializing Firebase", error);
        });
}

export const auth = firebase().auth();
export const firestore = firebase().firestore();