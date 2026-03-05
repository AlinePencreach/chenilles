import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coords } from '@/lib/types';

export function useLocation() {
  const [location, setLocation] = useState<Coords | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).then((pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      });
    });
  }, []);

  return { location, permissionDenied };
}
