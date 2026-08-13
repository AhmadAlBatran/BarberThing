import { initializeApp } from "firebase/app";
// @ts-ignore - getReactNativePersistence exists at runtime but isn't in the TS types yet

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "barberthing-9bc3d.firebasestorage.app",
  messagingSenderId: "262740951325",
  appId: "1:262740951325:web:e6b1e7f4f134725739a1f4"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);

export default app;
