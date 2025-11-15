
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- START CONFIGURATION ---
// IMPORTANT: Replace the placeholder values below with your actual
// credentials from your Firebase project and Google AI Studio.

// 1. Firebase Configuration (for Cloud Sync & Auth)
// Create a project at https://console.firebase.google.com/, add a Web App,
// and copy the config object here.
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

// 2. Google Gemini API Key (for AI Insights)
// Get your key from Google AI Studio: https://aistudio.google.com/
export const geminiApiKey = "YOUR_GEMINI_API_KEY";

// --- END CONFIGURATION ---


let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Check if the essential configuration keys are placeholders.
export const firebaseConfigExists = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.startsWith("YOUR_") &&
    !firebaseConfig.apiKey.startsWith("PASTE_")
);

export const geminiApiKeyExists = !!(geminiApiKey && !geminiApiKey.startsWith("YOUR_") && !geminiApiKey.startsWith("PASTE_"));

if (firebaseConfigExists) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        // Reset to null if initialization fails, so the app knows it's not available.
        app = null;
        auth = null;
        db = null;
    }
} else {
    console.warn("Firebase configuration is missing or contains placeholder values in 'services/firebase.ts'. The app will run in local-only mode if you choose to 'continue without an account'.");
}

export { app, auth, db };