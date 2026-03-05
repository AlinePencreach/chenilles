import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Afficher les notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('signalements', {
      name: 'Signalements',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** Enregistre le token push Expo dans Supabase (pour envois serveur futurs). */
export async function registerPushToken(deviceId: string): Promise<void> {
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return;

    const { data: tokenData } = await Notifications.getExpoPushTokenAsync({ projectId });
    await supabase
      .from('push_tokens')
      .upsert({ device_id: deviceId, token: tokenData }, { onConflict: 'device_id' });
  } catch {
    // Enregistrement du token optionnel — pas bloquant
  }
}

/** Déclenche une notification locale immédiate pour un nouveau nid à proximité. */
export async function notifyNewNest(lieu: string, distanceM: number): Promise<void> {
  const label = distanceM < 1000
    ? `${Math.round(distanceM)} m`
    : `${(distanceM / 1000).toFixed(1)} km`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🫧 Nouveau signalement près de vous',
      body: `${lieu} — à ${label}`,
    },
    trigger: null,
  });
}
