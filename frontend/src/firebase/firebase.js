// src/firebase/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCLRIlaC6PEWxaX-ywaKzuHqiASBnoZE_Q",
    authDomain: "valle-das-flores.firebaseapp.com",
    projectId: "valle-das-flores",
    storageBucket: "valle-das-flores.firebasestorage.app",
    messagingSenderId: "327706757304",
    appId: "1:327706757304:web:9b73933d3a50552d830c4d",
    measurementId: "G-MT2RNQHZ6P"
  };
  

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
