import { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNests } from '@/hooks/useNests';
import { useLocation } from '@/hooks/useLocation';
import { NestCard } from '@/components/NestCard';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { haversine } from '@/lib/haversine';
import type { Nest } from '@/lib/types';

type SortMode = 'distance' | 'date';

export default function ProximiteScreen() {
  const { nests, loading, refresh } = useNests();
  const { location } = useLocation();
  const [sortMode, setSortMode] = useState<SortMode>('distance');

  const sorted = [...nests].sort((a, b) => {
    if (sortMode === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (!location) return 0;
    const da = haversine(location.latitude, location.longitude, a.latitude, a.longitude);
    const db = haversine(location.latitude, location.longitude, b.latitude, b.longitude);
    return da - db;
  });

  return (
    <View style={styles.container}>
      {/* Sort toggle */}
      <View style={styles.sortRow}>
        <TouchableOpacity
          style={[styles.sortBtn, sortMode === 'distance' && styles.sortBtnActive]}
          onPress={() => setSortMode('distance')}
        >
          <Text style={[styles.sortLabel, sortMode === 'distance' && styles.sortLabelActive]}>
            Par distance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, sortMode === 'date' && styles.sortBtnActive]}
          onPress={() => setSortMode('date')}
        >
          <Text style={[styles.sortLabel, sortMode === 'date' && styles.sortLabelActive]}>
            Par date
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NestCard nest={item} userLocation={location} />
        )}
        contentContainerStyle={styles.list}
        onRefresh={refresh}
        refreshing={loading}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>Aucun nid signalé pour l'instant.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  sortRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: colors.bark,
  },
  sortBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.moss,
  },
  sortBtnActive: { backgroundColor: colors.moss },
  sortLabel: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    color: colors.cream + '80',
  },
  sortLabelActive: { color: colors.cream },
  list: { padding: 12, gap: 10 },
  empty: {
    ...typography.body,
    color: colors.bark + '80',
    textAlign: 'center',
    marginTop: 60,
  },
});
