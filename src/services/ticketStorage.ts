import * as FileSystem from 'expo-file-system';

import type { TicketData } from '../types/TicketData';

type LockState = {
  lockNumber: number;
  lockHour: number;
};

// Le typings di questa versione non espongono `documentDirectory`, ma a runtime la directory esiste.
const baseDir: string = (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? '';
const DIR = `${baseDir}arriva_clone/`;
const TICKET_PATH = `${DIR}ticket.json`;
const LOCK_PATH = `${DIR}lock.json`;

async function ensureDir(): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(DIR);
    if (info.exists) return;
    await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  } catch {
    // In caso di race/permessi, l’operazione successiva fallirà e gestiamo a livello chiamante.
  }
}

export async function saveTicketData(ticket: TicketData): Promise<void> {
  await ensureDir();
  await FileSystem.writeAsStringAsync(TICKET_PATH, JSON.stringify(ticket), {
    encoding: (FileSystem as any).EncodingType?.UTF8 ?? undefined,
  });
}

export async function loadTicketData(): Promise<TicketData | null> {
  const info = await FileSystem.getInfoAsync(TICKET_PATH);
  if (!info.exists) return null;
  const raw = await FileSystem.readAsStringAsync(TICKET_PATH);
  try {
    return JSON.parse(raw) as TicketData;
  } catch {
    return null;
  }
}

export async function saveLockState(state: LockState): Promise<void> {
  await ensureDir();
  await FileSystem.writeAsStringAsync(LOCK_PATH, JSON.stringify(state), {
    encoding: (FileSystem as any).EncodingType?.UTF8 ?? undefined,
  });
}

export async function loadLockState(): Promise<LockState | null> {
  const info = await FileSystem.getInfoAsync(LOCK_PATH);
  if (!info.exists) return null;
  const raw = await FileSystem.readAsStringAsync(LOCK_PATH);
  try {
    return JSON.parse(raw) as LockState;
  } catch {
    return null;
  }
}

