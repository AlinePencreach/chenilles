import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import type { NestStatus } from '@/lib/types';

const STATUS_CONFIG: Record<NestStatus, { label: string; bg: string; text: string }> = {
  signale: { label: 'Signalé', bg: colors.red + '20', text: colors.red },
  signale_mairie: { label: '🏛️ Mairie prévenue', bg: colors.amber + '20', text: colors.amber },
  traite: { label: '✅ Traité', bg: colors.green + '20', text: colors.green },
};

type Props = { status: NestStatus };

export function Badge({ status }: Props) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.label, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
  },
});
