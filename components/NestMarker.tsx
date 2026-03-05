import { View, Text, StyleSheet } from 'react-native';
import type { Nest } from '@/lib/types';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const EMOJI: Record<string, string> = { nid: '🫧', procession: '🐛' };

type Props = { nest: Nest };

/** Teardrop marker — cercle tourné à -45° avec emoji centré. */
export function NestMarker({ nest }: Props) {
  const isRecent = Date.now() - new Date(nest.created_at).getTime() < SEVEN_DAYS;

  const bg =
    nest.status === 'rejete' ? '#9CA3AF' :
    nest.status === 'traite' ? '#375530' :
    nest.status === 'mairie' ? '#C98520' :
    isRecent                 ? '#C0402A' : '#C98520';

  const opacity = nest.status === 'traite' || nest.status === 'rejete' ? 0.45 : 1;

  return (
    <View style={[styles.drop, { backgroundColor: bg, opacity }]}>
      <Text style={styles.emoji}>{EMOJI[nest.type] ?? '⚠️'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  drop: {
    width: 28,
    height: 28,
    borderRadius: 14,
    // Teardrop : coin bas-gauche carré via borderBottomLeftRadius
    borderBottomLeftRadius: 2,
    transform: [{ rotate: '-45deg' }],
    borderWidth: 2.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emoji: {
    fontSize: 12,
    // Contre-rotation pour garder l'emoji droit
    transform: [{ rotate: '45deg' }],
  },
});
