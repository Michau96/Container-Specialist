import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserAccount, UserBalconySpec, MyCropItem } from '../types';
import { DEFAULT_BALCONY_SPEC } from './api';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Connect to the specific database provisioned for this applet
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Storage keys shared with the rest of the application
export const TOKEN_STORAGE_KEY = 'balkonowy_auth_token';
export const USER_STORAGE_KEY = 'balkonowy_current_user';

// Operation types for standard error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial Firestore connection test (mandated by Firestore guidelines)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase: client is currently offline.');
    }
    return false;
  }
}

// Kick off silent background test on module evaluation
testFirestoreConnection().catch(() => {});

/**
 * Sign in or Register using Google Account with a popup.
 * If user does not exist in Firestore, initializes their profile and attaches
 * their current balcony spec and selected crops.
 */
export async function signInWithGoogle(
  balconySpecToAttach?: UserBalconySpec,
  cropsToAttach?: MyCropItem[]
): Promise<{ user: UserAccount; token: string; message: string; isNewUser: boolean }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser: FirebaseUser = result.user;
    const token = await fbUser.getIdToken();

    const userDocRef = doc(db, 'users', fbUser.uid);
    let userDoc;
    try {
      userDoc = await getDoc(userDocRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
    }

    const now = new Date().toISOString();
    let userAccount: UserAccount;
    let isNewUser = false;
    let message = '';

    if (!userDoc.exists()) {
      isNewUser = true;
      const initialSpec = balconySpecToAttach || DEFAULT_BALCONY_SPEC;
      const initialCrops = cropsToAttach || [];
      const username = fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Ogrodnik');

      const newUserData = {
        id: fbUser.uid,
        username,
        email: fbUser.email || '',
        displayName: fbUser.displayName || '',
        photoURL: fbUser.photoURL || '',
        createdAt: now,
        lastLoginAt: now,
        updatedAt: now,
        authProvider: 'google' as const,
        balconySpec: initialSpec,
        myCrops: initialCrops,
      };

      try {
        await setDoc(userDocRef, newUserData);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${fbUser.uid}`);
      }

      userAccount = {
        id: fbUser.uid,
        username,
        email: fbUser.email || undefined,
        displayName: fbUser.displayName || undefined,
        photoURL: fbUser.photoURL || undefined,
        authProvider: 'google',
        createdAt: now,
        lastLoginAt: now,
        balconySpec: initialSpec,
        myCrops: initialCrops,
      };

      message = `Konto Google zostało pomyślnie zarejestrowane! Witaj w Donicowym Specjaliście, ${username}!`;
    } else {
      // Existing user: load saved profile
      const data = userDoc.data();
      const loadedSpec: UserBalconySpec = data.balconySpec || balconySpecToAttach || DEFAULT_BALCONY_SPEC;
      const loadedCrops: MyCropItem[] = Array.isArray(data.myCrops) ? data.myCrops : [];

      // Update last login timestamp
      try {
        await updateDoc(userDocRef, {
          lastLoginAt: now,
          updatedAt: now,
          photoURL: fbUser.photoURL || data.photoURL || '',
          displayName: fbUser.displayName || data.displayName || '',
        });
      } catch (err) {
        // Non-blocking update error
        console.warn('Could not update lastLoginAt in Firestore:', err);
      }

      const username = data.username || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Ogrodnik');

      userAccount = {
        id: fbUser.uid,
        username,
        email: fbUser.email || data.email || undefined,
        displayName: fbUser.displayName || data.displayName || undefined,
        photoURL: fbUser.photoURL || data.photoURL || undefined,
        authProvider: 'google',
        createdAt: data.createdAt || now,
        lastLoginAt: now,
        balconySpec: loadedSpec,
        myCrops: loadedCrops,
      };

      message = `Witaj ponownie, ${username}! Wczytano dane Twojego balkonu z chmury.`;
    }

    // Persist session to local storage for fast app boot
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userAccount));

    return {
      user: userAccount,
      token,
      message,
      isNewUser,
    };
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Logowanie przez Google zostało anulowane (zamknięto okno).');
    }
    if (err.code === 'auth/popup-blocked') {
      throw new Error('Przeglądarka zablokowała wyskakujące okno logowania Google. Zezwól na wyskakujące okna dla tej strony.');
    }
    if (err.code === 'auth/cancelled-popup-request') {
      throw new Error('Operacja logowania została przerwana. Spróbuj ponownie.');
    }
    console.error('Google Auth Error:', err);
    throw new Error(err.message || 'Wystąpił błąd podczas autoryzacji z kontem Google.');
  }
}

/**
 * Synchronizes balcony specifications and crops to Firestore if the user is authenticated via Google.
 */
export async function saveBalconyToFirestore(
  userId: string,
  spec: UserBalconySpec,
  myCrops?: MyCropItem[]
): Promise<boolean> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return false;
  }
  const userDocRef = doc(db, 'users', userId);
  try {
    await updateDoc(userDocRef, {
      balconySpec: spec,
      myCrops: myCrops || [],
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    return false;
  }
}

/**
 * Sign out from Firebase and clean storage.
 */
export async function logoutFirebaseUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase sign out error:', err);
  }
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
