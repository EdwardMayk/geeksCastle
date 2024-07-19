import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const firestore = admin.firestore();
firestore.settings({
  host: 'localhost:8080',
  ssl: false,
});

export const Firestore = admin.firestore();
