import { View, Text, StyleSheet } from 'react-native';
import type { NestStatus } from '@/lib/types';

// Colors matching the HTML prototype exactly
const STATUS_CONFIG: Record<NestStatus, { label: string; bg: string; text: string }> = {
  signale:  { label: 'Signalé',          bg: '#FEE2E2', text: '#C0402A' },
  mairie:   { label: '🏛️ Mairie',        bg: '#FEF3C7', text: '#92400E' },
  traite:   { label: '✅ Traité',         bg: '#D1FAE5', text: '#065F46' },
  rejete:   { label: '✗ Rejeté',         bg: '#F3F4F6', text: '#6B7280' },
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
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'DMMono-Regular',
    fontSize: 10,
    fontWeight: '600',
  },
});
