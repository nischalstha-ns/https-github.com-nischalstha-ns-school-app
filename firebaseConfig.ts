// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAWhkThVR0uoDxUdI4vudjS8bXZLHSrAs",
  authDomain: "app-making-20c78.firebaseapp.com",
  projectId: "app-making-20c78",
  storageBucket: "app-making-20c78.appspot.com",
  messagingSenderId: "677933099163",
  appId: "1:677933099163:web:3b92aba381b2ce0d4abe3e",
  measurementId: "G-KDTFX47D8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics
const analytics = getAnalytics(app);