import * as SecureStore from 'expo-secure-store';
import { randomUUID } from 'expo-crypto';

const DEVICE_ID_KEY = 'chenilles_device_id';

/** Retourne un UUID persistant lié à l'appareil (jamais de compte requis). */
export async function getDeviceId(): Promise<string> {
  let id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (!id) {
    id = randomUUID();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  }
  return id;
}
