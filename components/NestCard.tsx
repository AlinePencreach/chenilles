import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Badge } from './Badge';
import { haversine, formatDistance } from '@/lib/haversine';
import type { Nest, Coords } from '@/lib/types';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const EMOJI: Record<string, string> = { nid: '🫧', procession: '🐛' };

type Props = {
  nest: Nest;
  userLocation: Coords | null;
  onPress?: () => void;
};

export function NestCard({ nest, userLocation, onPress }: Props) {
  const distance = userLocation
    ? formatDistance(haversine(userLocation.latitude, userLocation.longitude, nest.latitude, nest.longitude))
    : null;

  const date = new Date(nest.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  const isRecent = Date.now() - new Date(nest.created_at).getTime() < SEVEN_DAYS;
  const dotColor =
    nest.status === 'traite' ? colors.moss :
    nest.status === 'mairie' ? '#C98520' :
    isRecent                 ? colors.red : '#C98520';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.body}>
        <Text style={styles.lieu} numberOfLines={1}>
          {EMOJI[nest.type] ?? '⚠️'} {nest.lieu || 'Position sur carte'}
        </Text>
        {nest.description ? (
          <Text style={styles.desc} numberOfLines={2}>{nest.description}</Text>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={styles.date}>{date}</Text>
          {distance ? <Text style={styles.dist}>📍 {distance}</Text> : null}
        </View>
        {nest.status !== 'signale' && <Badge status={nest.status} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26,14,6,.07)',
    backgroundColor: colors.cream,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    flexShrink: 0,
  },
  body: { flex: 1, minWidth: 0 },
  lieu: { ...typography.body, fontFamily: 'Fraunces-SemiBold', color: colors.bark, marginBottom: 2 },
  desc: { ...typography.body, fontSize: 12, color: '#6b5740', fontStyle: 'italic', lineHeight: 16, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  date: { fontFamily: 'DMMono-Regular', fontSize: 10, color: '#9a7e66' },
  dist: { fontFamily: 'DMMono-Regular', fontSize: 10, color: colors.moss, fontWeight: '500' },
});
