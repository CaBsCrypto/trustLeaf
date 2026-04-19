import * as admin from "firebase-admin";

let _app: admin.app.App | null = null;

export function getFirestore(): admin.firestore.Firestore {
  if (!_app) {
    _app = admin.initializeApp({
      credential: admin.credential.cert(
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH
          ? require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
          : JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? "{}")
      ),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
  return admin.firestore();
}
