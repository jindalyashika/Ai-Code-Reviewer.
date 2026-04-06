import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcqHb1ey7JoAViKmLUOaSkIT_bCT_i7Tk",
  authDomain: "ai-code-reviewer-5d899.firebaseapp.com",
  projectId: "ai-code-reviewer-5d899",
  storageBucket: "ai-code-reviewer-5d899.firebasestorage.app",
  messagingSenderId: "930403104466",
  appId: "1:930403104466:web:f3c648e04dbbad1ab99f0b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();