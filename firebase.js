// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrxnFOx2UM3imjnZb_TeA-cNDRCzOEXVw",
  authDomain: "tinder-2-3c9b7.firebaseapp.com",
  projectId: "tinder-2-3c9b7",
  storageBucket: "tinder-2-3c9b7.appspot.com",
  messagingSenderId: "91581362147",
  appId: "1:91581362147:web:0ac36cea852c6e95aafad6",
  measurementId: "G-G26LNTKYHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

export { auth, db }