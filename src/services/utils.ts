import * as FileSystem from 'expo-file-system';

export async function readAsBase64IfPossible(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, {
    // Alcune versioni dei typings expo-file-system non espongono più EncodingType.
    // `readAsStringAsync` accetta comunque stringhe tipo "base64".
    encoding: 'base64' as any,
  });
}

