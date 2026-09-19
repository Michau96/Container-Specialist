import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import express, { Request, Response } from 'express';
import { UserAccount, UserBalconySpec, MyCropItem } from '../src/types';

interface StoredUser {
  id: string;
  username: string;
  normalizedUsername: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt: string;
  balconySpec: UserBalconySpec;
  myCrops?: MyCropItem[];
}

interface UserDatabase {
  users: StoredUser[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

interface SessionRecord {
  userId: string;
  createdAt: number;
}

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      const initialDb: UserDatabase = { users: [] };
      fs.writeFileSync(USERS_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    }
    if (!fs.existsSync(SESSIONS_FILE)) {
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[Auth Storage] Failed to ensure data directory:', err);
  }
}

function loadSessions(): Map<string, SessionRecord> {
  ensureDataDir();
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const map = new Map<string, SessionRecord>();
        const now = Date.now();
        const MAX_SESSION_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
        for (const [token, record] of Object.entries(parsed)) {
          if (record && typeof record === 'object' && (record as any).userId) {
            const age = now - ((record as any).createdAt || 0);
            if (age < MAX_SESSION_AGE_MS) {
              map.set(token, record as SessionRecord);
            }
          }
        }
        return map;
      }
    }
  } catch (err) {
    console.warn('[Auth Storage] Could not read sessions file:', err);
  }
  return new Map<string, SessionRecord>();
}

function saveSessions(sessionsMap: Map<string, SessionRecord>): void {
  ensureDataDir();
  try {
    const obj: Record<string, SessionRecord> = {};
    sessionsMap.forEach((v, k) => {
      obj[k] = v;
    });
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Auth Storage] Failed to save sessions file:', err);
  }
}

const sessions = loadSessions();

function loadDatabase(): UserDatabase {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.users)) {
      return parsed;
    }
  } catch (err) {
    console.warn('[Auth Storage] Could not read users file, starting empty:', err);
  }
  return { users: [] };
}

function saveDatabase(db: UserDatabase): void {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Auth Storage] Failed to save users file:', err);
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function sanitizeUser(user: StoredUser): UserAccount {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    balconySpec: user.balconySpec,
    myCrops: user.myCrops || [],
    lastLoginAt: user.lastLoginAt,
  };
}

export function createAuthRouter(): express.Router {
  const router = express.Router();

  // Middleware to authenticate Bearer token
  const getAuthenticatedUser = (req: Request): StoredUser | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1]?.trim();
    if (!token) return null;

    const session = sessions.get(token);
    if (!session) return null;

    const db = loadDatabase();
    const user = db.users.find((u) => u.id === session.userId);
    return user || null;
  };

  // POST /api/auth/register
  router.post('/register', (req: Request, res: Response): void => {
    try {
      const { username, password, balconySpec, myCrops } = req.body || {};

      if (!username || typeof username !== 'string') {
        res.status(400).json({ error: 'Podaj nick użytkownika.' });
        return;
      }

      const trimmedNick = username.trim();
      if (trimmedNick.length < 2) {
        res.status(400).json({ error: 'Nick musi mieć co najmniej 2 znaki.' });
        return;
      }
      if (trimmedNick.length > 30) {
        res.status(400).json({ error: 'Nick może mieć maksymalnie 30 znaków.' });
        return;
      }

      // Allow letters, numbers, spaces, underscores, dashes
      const nickRegex = /^[\p{L}\p{N}_\-\s]+$/u;
      if (!nickRegex.test(trimmedNick)) {
        res.status(400).json({
          error: 'Nick może zawierać litery, cyfry, spacje, myślniki i podkreślenia.',
        });
        return;
      }

      if (!password || typeof password !== 'string' || password.length < 4) {
        res.status(400).json({ error: 'Hasło musi mieć co najmniej 4 znaki.' });
        return;
      }

      const db = loadDatabase();
      const normalized = trimmedNick.toLowerCase();
      const existing = db.users.find((u) => u.normalizedUsername === normalized);

      if (existing) {
        res.status(409).json({
          error: `Konto o nicku "${trimmedNick}" już istnieje. Wybierz inny nick lub zaloguj się.`,
        });
        return;
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(password, salt);
      const userId = `usr_${crypto.randomUUID()}`;
      const now = new Date().toISOString();

      const defaultSpec: UserBalconySpec = {
        region: 'mazowieckie',
        floor: 3,
        orientation: 'S',
        balcony_type: 'open_rail',
        roofing: 'uncovered',
        pots: ['boxes_balcony_15cm', 'pots_medium_5_15', 'pots_large_15_30'],
        care_time: 'daily',
      };

      const newUser: StoredUser = {
        id: userId,
        username: trimmedNick,
        normalizedUsername: normalized,
        salt,
        passwordHash,
        createdAt: now,
        lastLoginAt: now,
        balconySpec: balconySpec && typeof balconySpec === 'object' ? balconySpec : defaultSpec,
        myCrops: Array.isArray(myCrops) ? myCrops : [],
      };

      db.users.push(newUser);
      saveDatabase(db);

      const token = `tok_${crypto.randomBytes(32).toString('hex')}`;
      sessions.set(token, { userId, createdAt: Date.now() });
      saveSessions(sessions);

      console.log(`[Auth] Registered new user "${trimmedNick}" (${userId})`);

      res.status(201).json({
        success: true,
        message: `Konto ${trimmedNick} zostało pomyślnie utworzone!`,
        token,
        user: sanitizeUser(newUser),
      });
    } catch (err) {
      console.error('[Auth Register Error]', err);
      res.status(500).json({ error: 'Wystąpił błąd podczas rejestracji konta.' });
    }
  });

  // POST /api/auth/login
  router.post('/login', (req: Request, res: Response): void => {
    try {
      const { username, password } = req.body || {};

      if (!username || !password) {
        res.status(400).json({ error: 'Podaj nick i hasło.' });
        return;
      }

      const trimmedNick = String(username).trim();
      const normalized = trimmedNick.toLowerCase();

      const db = loadDatabase();
      const user = db.users.find((u) => u.normalizedUsername === normalized);

      if (!user) {
        res.status(401).json({ error: 'Nie znaleziono konta o takim nicku.' });
        return;
      }

      const candidateHash = hashPassword(String(password), user.salt);
      const isMatch = crypto.timingSafeEqual(
        Buffer.from(candidateHash, 'hex'),
        Buffer.from(user.passwordHash, 'hex')
      );

      if (!isMatch) {
        res.status(401).json({ error: 'Niepoprawne hasło. Spróbuj ponownie.' });
        return;
      }

      user.lastLoginAt = new Date().toISOString();
      saveDatabase(db);

      const token = `tok_${crypto.randomBytes(32).toString('hex')}`;
      sessions.set(token, { userId: user.id, createdAt: Date.now() });
      saveSessions(sessions);

      console.log(`[Auth] User logged in "${user.username}" (${user.id})`);

      res.json({
        success: true,
        message: `Zalogowano jako ${user.username}!`,
        token,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('[Auth Login Error]', err);
      res.status(500).json({ error: 'Wystąpił błąd podczas logowania.' });
    }
  });

  // GET /api/auth/me
  router.get('/me', (req: Request, res: Response): void => {
    try {
      const user = getAuthenticatedUser(req);
      if (!user) {
        res.status(401).json({ error: 'Brak aktywnej sesji lub niepoprawny token.' });
        return;
      }

      res.json({
        success: true,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('[Auth Me Error]', err);
      res.status(500).json({ error: 'Błąd pobierania danych konta.' });
    }
  });

  // PUT /api/auth/balcony - Save balcony settings to the account
  router.put('/balcony', (req: Request, res: Response): void => {
    try {
      const user = getAuthenticatedUser(req);
      if (!user) {
        res.status(401).json({ error: 'Zaloguj się, aby zapisać ustawienia balkonu.' });
        return;
      }

      const { balconySpec, myCrops } = req.body || {};
      if (!balconySpec || typeof balconySpec !== 'object') {
        res.status(400).json({ error: 'Nieprawidłowe dane specyfikacji balkonu.' });
        return;
      }

      const db = loadDatabase();
      const dbUser = db.users.find((u) => u.id === user.id);
      if (!dbUser) {
        res.status(404).json({ error: 'Użytkownik nie istnieje.' });
        return;
      }

      dbUser.balconySpec = balconySpec;
      if (Array.isArray(myCrops)) {
        dbUser.myCrops = myCrops;
      }
      saveDatabase(db);

      console.log(`[Auth] Updated balcony spec for user "${dbUser.username}"`);

      res.json({
        success: true,
        message: 'Ustawienia balkonu zostały pomyślnie zapisane na Twoim koncie!',
        balconySpec: dbUser.balconySpec,
        user: sanitizeUser(dbUser),
      });
    } catch (err) {
      console.error('[Auth Save Balcony Error]', err);
      res.status(500).json({ error: 'Błąd podczas zapisywania parametrów balkonu.' });
    }
  });

  // PUT /api/auth/crops - Save crops to account
  router.put('/crops', (req: Request, res: Response): void => {
    try {
      const user = getAuthenticatedUser(req);
      if (!user) {
        res.status(401).json({ error: 'Zaloguj się, aby zapisać uprawy.' });
        return;
      }

      const { myCrops } = req.body || {};
      if (!Array.isArray(myCrops)) {
        res.status(400).json({ error: 'Nieprawidłowe dane upraw.' });
        return;
      }

      const db = loadDatabase();
      const dbUser = db.users.find((u) => u.id === user.id);
      if (!dbUser) {
        res.status(404).json({ error: 'Użytkownik nie istnieje.' });
        return;
      }

      dbUser.myCrops = myCrops;
      saveDatabase(db);

      res.json({
        success: true,
        message: 'Lista upraw została zaktualizowana na Twoim koncie.',
        myCrops: dbUser.myCrops,
      });
    } catch (err) {
      console.error('[Auth Save Crops Error]', err);
      res.status(500).json({ error: 'Błąd podczas zapisywania listy upraw.' });
    }
  });

  // POST /api/auth/logout
  router.post('/logout', (req: Request, res: Response): void => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]?.trim();
        if (token) {
          sessions.delete(token);
          saveSessions(sessions);
        }
      }
      res.json({ success: true, message: 'Wylogowano pomyślnie.' });
    } catch (err) {
      console.error('[Auth Logout Error]', err);
      res.status(500).json({ error: 'Błąd podczas wylogowywania.' });
    }
  });

  // GET /api/auth/users-list - list registered usernames (public non-sensitive)
  router.get('/users-list', (_req: Request, res: Response): void => {
    try {
      const db = loadDatabase();
      const list = db.users.map((u) => ({
        id: u.id,
        username: u.username,
        region: u.balconySpec.region,
        floor: u.balconySpec.floor,
        orientation: u.balconySpec.orientation,
        cropsCount: u.myCrops ? u.myCrops.length : 0,
      }));
      res.json({ users: list });
    } catch {
      res.json({ users: [] });
    }
  });

  return router;
}
