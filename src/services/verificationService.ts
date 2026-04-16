import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Tesseract from 'tesseract.js';

import { readAsBase64IfPossible } from './utils';

export type VerificationSuccess = {
  matchFound: boolean;
  recognizedLines: string[];
};

export type VerificationCancelled = { cancelled: true };

export type VerificationResult = VerificationSuccess | VerificationCancelled;

export async function verifyCfFromCamera(cfInserito: string): Promise<VerificationResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) throw new Error('Permesso fotocamera negato.');

  const capture = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (capture.canceled || capture.assets.length === 0) return { cancelled: true };

  const originalUri = capture.assets[0].uri;
  if (!originalUri) return { cancelled: true };

  // 2) COMPRESSIONE LOCALE (circa 200KB-ish, dipende dal dispositivo)
  let compressedUri: string | null = null;
  try {
    const compressed = await manipulateAsync(
      originalUri,
      [
        // Risize “safe” per ridurre bitrate; evitiamo di forzare troppi tagli.
        { resize: { width: 1080, height: 1080 } },
      ],
      { compress: 0.7, format: SaveFormat.JPEG }
    );
    compressedUri = compressed.uri;

    // 3) OCR
    const base64 = await readAsBase64IfPossible(compressedUri);

    const worker = await Tesseract.createWorker();
    // worker types (tesseract.js) usano `reinitialize` per scegliere le lingue.
    await worker.reinitialize('ita');

    // tesseract.js può riconoscere anche una data URI.
    const dataUri = `data:image/jpeg;base64,${base64}`;
    const result = await worker.recognize(dataUri);
    await worker.terminate();

    const text: string = result.data.text ?? '';

    const recognizedLines = text
      .split(/\r?\n/)
      .map((l: string) => l.toUpperCase().trim())
      .filter((l: string) => Boolean(l));

    const normalizedCf = cfInserito.replace(/\s+/g, '');

    const matchFound = recognizedLines.some((line) =>
      line.replace(/\s+/g, '').includes(normalizedCf)
    );

    return { matchFound, recognizedLines };
  } finally {
    // 4) PRIVACY: eliminiamo subito le foto temporanee
    try {
      await FileSystem.deleteAsync(originalUri, { idempotent: true });
    } catch {
      // ignore
    }
    if (compressedUri) {
      try {
        await FileSystem.deleteAsync(compressedUri, { idempotent: true });
      } catch {
        // ignore
      }
    }
  }
}

