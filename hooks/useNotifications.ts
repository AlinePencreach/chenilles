import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getDeviceId } from '@/lib/deviceId';
import {
  requestNotificationPermission,
  registerPushToken,
  notifyNewNest,
} from '@/lib/notifications';
import { haversine } from '@/lib/haversine';
import type { Coords } from '@/lib/types';

/** Rayon d'alerte : notifie si un nouveau nid est signalé dans ce périmètre. */
const ALERT_RADIUS_M = 2000;

export function useNotifications(userLocation: Coords | null) {
  const permGranted = useRef(false);

  // Demander la permission + enregistrer le token push au démarrage
  useEffect(() => {
    async function setup() {
      const granted = await requestNotificationPermission();
      permGranted.current = granted;
      if (!granted) return;

      const deviceId = await getDeviceId();
      await registerPushToken(deviceId);
    }
    setup();
  }, []);

  // Écouter les nouveaux signalements en temps réel et notifier si proche
  useEffect(() => {
    if (!userLocation) return;

    const channel = supabase
      .channel('nests-notify')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'nests' },
        async (payload) => {
          if (!permGranted.current) return;

          const nest = payload.new as { lieu: string; latitude: number; longitude: number };
          const distance = haversine(
            userLocation.latitude,
            userLocation.longitude,
            nest.latitude,
            nest.longitude,
          );

          if (distance <= ALERT_RADIUS_M) {
            await notifyNewNest(nest.lieu, distance);
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userLocation]);
}
