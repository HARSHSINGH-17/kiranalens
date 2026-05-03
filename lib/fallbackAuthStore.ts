import bcrypt from 'bcryptjs';

export type FallbackUser = {
  id: string;
  email: string;
  name: string;
  organisation: string | null;
  password_hash: string;
  role: 'admin' | 'credit_officer' | 'branch_manager';
  created_at: string;
};

type FallbackAuthStore = {
  usersByEmail: Map<string, FallbackUser>;
};

const DEMO_USER_EMAIL = 'demo@kiranalens.com';
const DEMO_USER_PASSWORD_HASH =
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKB./Jmf0T/FiZBO';

const globalStore = globalThis as typeof globalThis & {
  __fallbackAuthStore?: FallbackAuthStore;
};

const demoUser: FallbackUser = {
  id: 'demo-user',
  email: DEMO_USER_EMAIL,
  name: 'Demo User',
  organisation: 'KiranaLens Demo',
  password_hash: DEMO_USER_PASSWORD_HASH,
  role: 'credit_officer',
  created_at: new Date().toISOString(),
};

export function getFallbackAuthStore(): FallbackAuthStore {
  if (!globalStore.__fallbackAuthStore) {
    globalStore.__fallbackAuthStore = {
      usersByEmail: new Map([[DEMO_USER_EMAIL, demoUser]]),
    };
  }

  return globalStore.__fallbackAuthStore;
}

export function getFallbackUser(email: string): FallbackUser | undefined {
  const store = getFallbackAuthStore();
  return store.usersByEmail.get(email.toLowerCase());
}

export async function createFallbackUser(data: {
  email: string;
  name: string;
  organisation?: string | null;
  password: string;
}): Promise<FallbackUser> {
  const store = getFallbackAuthStore();
  const user: FallbackUser = {
    id: crypto.randomUUID(),
    email: data.email.toLowerCase(),
    name: data.name,
    organisation: data.organisation ?? null,
    password_hash: await bcrypt.hash(data.password, 12),
    role: 'credit_officer',
    created_at: new Date().toISOString(),
  };

  store.usersByEmail.set(user.email, user);
  return user;
}
