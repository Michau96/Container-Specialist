import { UserAccount, UserBalconySpec, MyCropItem, Language } from '../types';
import { saveBalconyToFirestore, logoutFirebaseUser } from './firebase';

const TOKEN_STORAGE_KEY = 'balkonowy_auth_token';
const USER_STORAGE_KEY = 'balkonowy_current_user';
const ACCOUNTS_STORAGE_KEY = 'balkonowy_saved_accounts_v1';

// Fallback local account interface when offline
interface LocalAccountRecord {
  id: string;
  username: string;
  normalizedUsername: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt: string;
  balconySpec: UserBalconySpec;
  myCrops?: MyCropItem[];
  language?: Language;
}

// Simple deterministic hash for offline fallback storage
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}_${str.length}`;
}

function getLocalAccountsDb(): LocalAccountRecord[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not parse local accounts:', err);
  }
  return [];
}

function saveLocalAccountsDb(accounts: LocalAccountRecord[]): void {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.warn('Could not save local accounts:', err);
  }
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): UserAccount | null {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      return null;
    }
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.username) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function getKnownLocalAccounts(): { id: string; username: string; lastLoginAt?: string }[] {
  const accounts = getLocalAccountsDb();
  return accounts.map((a) => ({
    id: a.id,
    username: a.username,
    lastLoginAt: a.lastLoginAt,
  }));
}

export function removeKnownLocalAccount(idOrUsername: string): void {
  const accounts = getLocalAccountsDb();
  const normalized = idOrUsername.toLowerCase();
  const filtered = accounts.filter(
    (a) => a.id !== idOrUsername && a.normalizedUsername !== normalized && a.username !== idOrUsername
  );
  saveLocalAccountsDb(filtered);
}

/**
 * Register a new user account with nickname and password,
 * linking their balcony settings to the newly created account.
 */
export async function registerAccount(
  username: string,
  password: string,
  balconySpec: UserBalconySpec,
  myCrops?: MyCropItem[],
  language?: Language
): Promise<{ user: UserAccount; token: string; message: string }> {
  const trimmed = username.trim();
  if (!trimmed || trimmed.length < 2) {
    throw new Error('Nick musi zawierać minimum 2 znaki.');
  }
  if (!password || password.length < 4) {
    throw new Error('Hasło musi zawierać minimum 4 znaki.');
  }

  const chosenLang: Language = language === 'en' ? 'en' : 'pl';

  // 1. Try server-side registration first
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: trimmed,
        password,
        balconySpec,
        myCrops: myCrops || [],
        language: chosenLang,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Błąd rejestracji konta na serwerze.');
    }

    const { token, user, message } = data;

    // Cache session
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    // Also sync to local storage database for instant offline access
    const localDb = getLocalAccountsDb();
    const existingIndex = localDb.findIndex(
      (a) => a.normalizedUsername === trimmed.toLowerCase()
    );
    const newRecord: LocalAccountRecord = {
      id: user.id,
      username: user.username,
      normalizedUsername: trimmed.toLowerCase(),
      passwordHash: simpleHash(password),
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || new Date().toISOString(),
      balconySpec: user.balconySpec,
      myCrops: user.myCrops,
      language: user.language || chosenLang,
    };
    if (existingIndex >= 0) {
      localDb[existingIndex] = newRecord;
    } else {
      localDb.push(newRecord);
    }
    saveLocalAccountsDb(localDb);

    return { user, token, message: message || `Konto ${trimmed} zostało utworzone!` };
  } catch (err: any) {
    // If it's a conflict error from the server (e.g. username taken), re-throw
    if (err.message && (err.message.includes('już istnieje') || err.message.includes('409'))) {
      throw err;
    }

    console.warn('Server registration failed or offline, falling back to local account engine:', err);

    // 2. Offline fallback registration
    const localDb = getLocalAccountsDb();
    const normalized = trimmed.toLowerCase();
    if (localDb.some((a) => a.normalizedUsername === normalized)) {
      throw new Error(`Konto o nicku "${trimmed}" już istnieje w pamięci aplikacji.`);
    }

    const userId = `usr_local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const localUser: UserAccount = {
      id: userId,
      username: trimmed,
      createdAt: now,
      lastLoginAt: now,
      balconySpec,
      myCrops: myCrops || [],
      language: chosenLang,
    };

    const record: LocalAccountRecord = {
      id: userId,
      username: trimmed,
      normalizedUsername: normalized,
      passwordHash: simpleHash(password),
      createdAt: now,
      lastLoginAt: now,
      balconySpec,
      myCrops: myCrops || [],
      language: chosenLang,
    };

    localDb.push(record);
    saveLocalAccountsDb(localDb);

    const fallbackToken = `tok_local_${Date.now()}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, fallbackToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));

    return {
      user: localUser,
      token: fallbackToken,
      message: `Konto ${trimmed} utworzone pomyślnie! Ustawienia Twojego balkonu zostały powiązane.`,
    };
  }
}

/**
 * Log into an existing account with nickname and password.
 * Loads the user's saved balcony settings into the session.
 */
export async function loginAccount(
  username: string,
  password: string
): Promise<{ user: UserAccount; token: string; message: string }> {
  const trimmed = username.trim();
  if (!trimmed) {
    throw new Error('Wprowadź swój nick.');
  }
  if (!password) {
    throw new Error('Wprowadź hasło.');
  }

  // 1. Try server-side login
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: trimmed,
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Niepoprawny nick lub hasło.');
    }

    const { token, user, message } = data;

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    // Update local accounts record
    const localDb = getLocalAccountsDb();
    const existingIndex = localDb.findIndex(
      (a) => a.normalizedUsername === trimmed.toLowerCase()
    );
    const updatedRecord: LocalAccountRecord = {
      id: user.id,
      username: user.username,
      normalizedUsername: trimmed.toLowerCase(),
      passwordHash: simpleHash(password),
      createdAt: user.createdAt,
      lastLoginAt: new Date().toISOString(),
      balconySpec: user.balconySpec,
      myCrops: user.myCrops,
    };
    if (existingIndex >= 0) {
      localDb[existingIndex] = updatedRecord;
    } else {
      localDb.push(updatedRecord);
    }
    saveLocalAccountsDb(localDb);

    return { user, token, message: message || `Witaj ponownie, ${user.username}!` };
  } catch (err: any) {
    // If error is invalid credentials from server, re-throw
    if (
      err.message &&
      (err.message.includes('Nie znaleziono') || err.message.includes('Niepoprawne hasło'))
    ) {
      throw err;
    }

    console.warn('Server login error, checking local fallback:', err);

    // 2. Check local fallback accounts
    const localDb = getLocalAccountsDb();
    const normalized = trimmed.toLowerCase();
    const record = localDb.find((a) => a.normalizedUsername === normalized);

    if (!record) {
      throw new Error('Nie znaleziono konta o podanym nicku.');
    }

    if (record.passwordHash !== simpleHash(password)) {
      throw new Error('Niepoprawne hasło.');
    }

    record.lastLoginAt = new Date().toISOString();
    saveLocalAccountsDb(localDb);

    const localUser: UserAccount = {
      id: record.id,
      username: record.username,
      createdAt: record.createdAt,
      lastLoginAt: record.lastLoginAt,
      balconySpec: record.balconySpec,
      myCrops: record.myCrops || [],
    };

    const fallbackToken = `tok_local_${Date.now()}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, fallbackToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));

    return {
      user: localUser,
      token: fallbackToken,
      message: `Zalogowano jako ${record.username}! Wczytano ustawienia Twojego balkonu.`,
    };
  }
}

/**
 * Fetch fresh user info from server or storage.
 */
export async function fetchCurrentUser(): Promise<UserAccount | null> {
  const token = getStoredToken();
  const cachedUser = getStoredUser();

  // If user is authenticated via Google, return stored user session
  if (cachedUser && cachedUser.authProvider === 'google') {
    return cachedUser;
  }

  if (!token) {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } else if (res.status === 401 || res.status === 403) {
      // Server rejected token -> clear session
      try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      } catch {
        // ignore
      }
      return null;
    }
  } catch (err) {
    console.warn('Network error while checking current user:', err);
  }

  // If offline fallback session
  const localDb = getLocalAccountsDb();
  if (cachedUser && localDb.some((a) => a.id === cachedUser.id)) {
    return cachedUser;
  }

  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // ignore
  }
  return null;
}

/**
 * Saves current balcony settings directly to the user's account.
 */
export async function saveBalconyToAccount(
  spec: UserBalconySpec,
  myCrops?: MyCropItem[]
): Promise<{ success: boolean; user?: UserAccount }> {
  const token = getStoredToken();
  const currentUser = getStoredUser();

  // Always update locally cached user
  if (currentUser) {
    currentUser.balconySpec = spec;
    if (myCrops) currentUser.myCrops = myCrops;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));

    // Update local accounts db
    const localDb = getLocalAccountsDb();
    const rec = localDb.find((a) => a.id === currentUser.id);
    if (rec) {
      rec.balconySpec = spec;
      if (myCrops) rec.myCrops = myCrops;
      saveLocalAccountsDb(localDb);
    }
  }

  if (currentUser?.id) {
    saveBalconyToFirestore(currentUser.id, spec, myCrops).catch((err) => {
      console.warn('Could not sync balcony to Firestore:', err);
    });
  }

  if (!token) {
    return { success: false };
  }

  try {
    const res = await fetch('/api/auth/balcony', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        balconySpec: spec,
        myCrops,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
    }
  } catch (err) {
    console.warn('Server save balcony error, preserved locally:', err);
  }

  return { success: true, user: currentUser || undefined };
}

/**
 * Log out of the current account.
 */
export async function logoutAccount(): Promise<void> {
  await logoutFirebaseUser().catch(() => {});

  const token = getStoredToken();
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // ignore
    }
  }

  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Update the user's preferred application language (persists to localStorage, local db, and server)
 */
export async function updateUserLanguage(language: Language): Promise<{ success: boolean; user?: UserAccount }> {
  let currentUser = getStoredUser();
  if (currentUser) {
    currentUser = {
      ...currentUser,
      language,
    };
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch {
      // ignore
    }

    // Update in local accounts db
    const localDb = getLocalAccountsDb();
    const idx = localDb.findIndex((a) => a.id === currentUser?.id);
    if (idx >= 0) {
      localDb[idx].language = language;
      saveLocalAccountsDb(localDb);
    }
  }

  // Attempt server update if user has an auth token
  const token = getStoredToken();
  if (token) {
    try {
      const res = await fetch('/api/auth/language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      }
    } catch (err) {
      console.warn('Server language update failed, preserved locally:', err);
    }
  }

  return { success: true, user: currentUser || undefined };
}

