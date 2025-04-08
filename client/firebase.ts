import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYUR-8cL7pXaFLHz9iLmP6eZQsfc_BkBQ",
  authDomain: "e-commerce-chat-224e7.firebaseapp.com",
  projectId: "e-commerce-chat-224e7",
  storageBucket: "e-commerce-chat-224e7.firebasestorage.app",
  messagingSenderId: "147665917546",
  appId: "1:147665917546:web:4de2ff81d91b78b25ddc13",
  measurementId: "G-R6SL5Z7TP4",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
