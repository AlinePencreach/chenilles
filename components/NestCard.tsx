import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Badge } from './Badge';
import { haversine, formatDistance } from '@/lib/haversine';
import type { Nest, Coords } from '@/lib/types';

type Props = {
  nest: Nest;
  userLocation: Coords | null;
  onPress?: () => void;
};

export function NestCard({ nest, userLocation, onPress }: Props) {
  const distance = userLocation
    ? formatDistance(haversine(userLocation.latitude, userLocation.longitude, nest.latitude, nest.longitude))
    : null;

  const date = new Date(nest.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });

  const emoji = nest.type === 'nid' ? '🫧' : '🐛';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.lieu} numberOfLines={1}>{nest.lieu}</Text>
          <View style={styles.meta}>
            {distance && <Text style={styles.metaText}>{distance}</Text>}
            <Text style={styles.metaText}>{date}</Text>
          </View>
        </View>
        <Badge status={nest.status} />
      </View>
      {nest.description && (
        <Text style={styles.description} numberOfLines={2}>{nest.description}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.bark + '15',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  lieu: { ...typography.body, color: colors.bark, fontFamily: 'Fraunces-SemiBold' },
  meta: { flexDirection: 'row', gap: 8, marginTop: 2 },
  metaText: { ...typography.mono, color: colors.bark + '60' },
  description: { ...typography.body, color: colors.bark + '80', marginTop: 8 },
});
