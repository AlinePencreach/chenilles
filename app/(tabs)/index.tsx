import { useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useNests } from '@/hooks/useNests';
import { useLocation } from '@/hooks/useLocation';
import { NestPopup } from '@/components/NestPopup';
import { NestMarker } from '@/components/NestMarker';
import { colors } from '@/constants/colors';
import type { Nest } from '@/lib/types';

// Vernègues, Bouches-du-Rhône (13116)
const VERNEGUES: Region = {
  latitude: 43.5275,
  longitude: 5.3236,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function CarteScreen() {
  const mapRef = useRef<MapView>(null);
  const { nests, loading } = useNests();
  const { location } = useLocation();
  const [selectedNest, setSelectedNest] = useState<Nest | null>(null);

  function handleMarkerPress(nest: Nest) {
    setSelectedNest(nest);
    mapRef.current?.animateToRegion(
      {
        latitude: nest.latitude,
        longitude: nest.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      400,
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={VERNEGUES}
        showsUserLocation
        showsMyLocationButton
        mapType="standard"
      >
        {nests.map((nest) => (
          <Marker
            key={nest.id}
            coordinate={{ latitude: nest.latitude, longitude: nest.longitude }}
            onPress={() => handleMarkerPress(nest)}
          >
            <NestMarker nest={nest} />
          </Marker>
        ))}
      </MapView>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.lichen} size="large" />
        </View>
      )}

      {selectedNest && (
        <NestPopup
          nest={selectedNest}
          userLocation={location}
          onClose={() => setSelectedNest(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: colors.bark + 'CC',
    borderRadius: 20,
    padding: 8,
  },
});
