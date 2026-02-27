import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDrh7WFaxv9sCo1Kmf0gD5HCZSVCvLky4Y',
  authDomain: 'innovatepam.firebaseapp.com',
  projectId: 'innovatepam',
  storageBucket: 'innovatepam.firebasestorage.app',
  messagingSenderId: '572975524295',
  appId: '1:572975524295:web:a0c4826ffdadbdfefa11e2',
  measurementId: 'G-1SD714TZZ5'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
