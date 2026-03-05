import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import type { Nest } from '@/lib/types';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

type Props = { nest: Nest };

export function NestMarker({ nest }: Props) {
  const isRecent = Date.now() - new Date(nest.created_at).getTime() < SEVEN_DAYS;
  const isTraite = nest.status === 'traite';

  const bgColor = isTraite
    ? colors.bark + '60'
    : isRecent
      ? colors.red
      : colors.amber;

  const emoji = nest.type === 'nid' ? '🫧' : '🐛';

  return (
    <View style={[styles.marker, { backgroundColor: bgColor }]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emoji: { fontSize: 18 },
});
