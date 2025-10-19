// Fix: Use scoped firebase packages to resolve module export errors. This change is applied across all firebase imports in this file.
import { initializeApp } from "@firebase/app";
import { getAnalytics, isSupported } from "@firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";

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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics if supported in the browser
isSupported().then((supported) => {
    if (supported) {
        getAnalytics(app);
    } else {
        console.log("Firebase Analytics is not supported in this environment.");
    }
});