import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCPB_amSoR8k2NK59asbZAMAzSepiEG40Q",
  authDomain: "mtvgeismar-3bf45.firebaseapp.com",
  databaseURL: "https://mtvgeismar-3bf45-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mtvgeismar-3bf45",
  storageBucket: "mtvgeismar-3bf45.firebasestorage.app",
  messagingSenderId: "346780246742",
  appId: "1:346780246742:web:16136e9150e4c844881f77"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 