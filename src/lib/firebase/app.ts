import { getAnalytics } from 'firebase/analytics'
import type { Analytics } from 'firebase/analytics'
import { initializeApp, getApps } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getFunctions } from 'firebase/functions'

let app: FirebaseApp

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const apps = getApps()
if (!apps.length) {
  app = initializeApp(config)
} else {
  app = apps[0]
}

const firestore = getFirestore(app)
const functions = getFunctions()
const auth = getAuth(app)
functions.region = 'us-central1'

let analytics: Analytics | undefined = undefined
if (app.name && typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export { firestore, functions, auth, config, analytics, app }
