import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const appEnv = createEnv({
  clientPrefix: "VITE_",
  client: {
    // Environment
    VITE_APP_ENVIRONMENT: z.string().optional(),

    // URLs
    VITE_API_BASE_URL: z.string().min(1),

    // Firebase
    VITE_FIREBASE_API_KEY: z.string().optional(),
    VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
    VITE_FIREBASE_PROJECT_ID: z.string().optional(),
    VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
    VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
    VITE_FIREBASE_APP_ID: z.string().optional(),
    VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
});

export const env = {
  environment: appEnv.VITE_APP_ENVIRONMENT,

  urls: {
    baseUrl: appEnv.VITE_API_BASE_URL,
  },

  firebaseConfig: {
    apiKey: appEnv.VITE_FIREBASE_API_KEY,
    authDomain: appEnv.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: appEnv.VITE_FIREBASE_PROJECT_ID,
    storageBucket: appEnv.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: appEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: appEnv.VITE_FIREBASE_APP_ID,
    measurementId: appEnv.VITE_FIREBASE_MEASUREMENT_ID,
  },
};

export default env;
