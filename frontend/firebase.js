
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "stylenest-f8a98.firebaseapp.com",
  projectId: "stylenest-f8a98",
  storageBucket: "stylenest-f8a98.firebasestorage.app",
  messagingSenderId: "199552448286",
  appId: "1:199552448286:web:f168643d45981ad4b33b0f",
  measurementId: "G-5P533L888F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app }