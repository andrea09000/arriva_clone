import * as FileSystem from 'expo-file-system';

// Le typings di questa versione non espongono `documentDirectory`, ma a runtime esiste.
const baseDir: string = (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? '';
const DIR = `${baseDir}arriva_clone/`;
const AUTH_PATH = `${DIR}auth.json`;

async function ensureDir(): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(DIR);
    if (info.exists) return;
    await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  } catch {
    // gestiamo errori a livello chiamante/lettura
  }
}

export async function signInWithEmail(email: string): Promise<void> {
  await ensureDir();
  await FileSystem.writeAsStringAsync(AUTH_PATH, JSON.stringify({ email }), {
    encoding: (FileSystem as any).EncodingType?.UTF8 ?? undefined,
  });
}

export async function getCurrentEmail(): Promise<string | null> {
  const info = await FileSystem.getInfoAsync(AUTH_PATH);
  if (!info.exists) return null;
  const raw = await FileSystem.readAsStringAsync(AUTH_PATH);
  try {
    const parsed = JSON.parse(raw) as { email?: string };
    return parsed.email ?? null;
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    await FileSystem.deleteAsync(AUTH_PATH, { idempotent: true });
  } catch {
    // ignore
  }
}

