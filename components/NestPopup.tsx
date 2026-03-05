import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Badge } from './Badge';
import { Button } from './Button';
import { haversine, formatDistance } from '@/lib/haversine';
import { supabase } from '@/lib/supabase';
import type { Nest, NestStatus, Coords } from '@/lib/types';
import { useState } from 'react';

type Props = {
  nest: Nest;
  userLocation: Coords | null;
  onClose: () => void;
};

const NEXT_STATUS: Partial<Record<NestStatus, NestStatus>> = {
  signale: 'signale_mairie',
  signale_mairie: 'traite',
};

const NEXT_LABEL: Partial<Record<NestStatus, string>> = {
  signale: '🏛️ Signaler à la mairie',
  signale_mairie: '✅ Marquer comme traité',
};

export function NestPopup({ nest, userLocation, onClose }: Props) {
  const [status, setStatus] = useState<NestStatus>(nest.status);
  const [updating, setUpdating] = useState(false);

  const distance = userLocation
    ? formatDistance(haversine(userLocation.latitude, userLocation.longitude, nest.latitude, nest.longitude))
    : null;

  const date = new Date(nest.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const nextStatus = NEXT_STATUS[status];
  const nextLabel = NEXT_LABEL[status];

  async function handleStatusUpdate() {
    if (!nextStatus) return;
    setUpdating(true);
    const { error } = await supabase
      .from('nests')
      .update({ status: nextStatus })
      .eq('id', nest.id);
    if (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut.');
    } else {
      setStatus(nextStatus);
    }
    setUpdating(false);
  }

  return (
    <View style={styles.popup}>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>{nest.type === 'nid' ? '🫧' : '🐛'}</Text>
      <Text style={styles.lieu}>{nest.lieu}</Text>

      <View style={styles.metaRow}>
        {distance && <Text style={styles.meta}>{distance}</Text>}
        <Text style={styles.meta}>{date}</Text>
        <Badge status={status} />
      </View>

      {nest.description && (
        <Text style={styles.description}>{nest.description}</Text>
      )}

      {nextLabel && (
        <Button
          label={nextLabel}
          onPress={handleStatusUpdate}
          loading={updating}
          variant="secondary"
          style={styles.actionBtn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: colors.cream,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 16, color: colors.bark + '80' },
  emoji: { fontSize: 28, marginBottom: 6 },
  lieu: { ...typography.h2, color: colors.bark, marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 10 },
  meta: { ...typography.mono, color: colors.bark + '60' },
  description: { ...typography.body, color: colors.bark + 'CC', marginBottom: 12 },
  actionBtn: { marginTop: 4 },
});
