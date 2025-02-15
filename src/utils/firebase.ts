import admin from 'firebase-admin';
import serviceAccount from '../../ServiceAccountKey.json';
import { ServiceAccount } from 'firebase-admin';

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export default app;
