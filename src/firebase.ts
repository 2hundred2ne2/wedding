import { initializeApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

// https://firebase.google.com/docs/web/setup?hl=ko
// Firebase 콘솔 > 프로젝트 설정 > 내 앱 에서 값을 확인해 `.env`에 입력합니다. (.env.example 참고)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

const isConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.databaseURL);

if (!isConfigured) {
  console.warn(
    '[firebase] .env에 Firebase 설정값이 없어 방명록 기능이 비활성화됩니다. .env.example을 참고해 .env를 채워주세요.',
  );
}

export const realtimeDb: Database | null = isConfigured
  ? getDatabase(initializeApp(firebaseConfig))
  : null;
