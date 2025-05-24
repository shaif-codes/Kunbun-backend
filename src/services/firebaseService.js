import admin from "firebase-admin";
import { firebaseAdminConfig, firebaseConfig } from "../config/index.js";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

// Initialize Firebase Admin SDK
if (
  firebaseAdminConfig.project_id &&
  firebaseAdminConfig.private_key &&
  firebaseAdminConfig.client_email
) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error.message);
  }
} else {
  console.warn(
    "Firebase Admin not initialized - missing required environment variables"
  );
}

// Initialize Firebase Client SDK (for auth operations)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Firebase service methods
export const firebaseService = {
  // Create user with email and password
  async createUserWithEmailAndPassword(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Sign in user with email and password
  async signInWithEmailAndPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Get user by UID using Admin SDK
  async getUserByUid(uid) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      throw error;
    }
  },

  // Verify ID token
  async verifyIdToken(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw error;
    }
  },

  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export { admin, app, auth };
