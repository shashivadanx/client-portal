import { env } from "@/lib/env";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";

const app = initializeApp(env.firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const analytics = getAnalytics(app);

export { auth, analytics, provider, onAuthStateChanged, signInWithRedirect };
