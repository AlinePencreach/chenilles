import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Badge } from './Badge';
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
  signale: 'mairie',
  mairie:  'traite',
};

const NEXT_LABEL: Partial<Record<NestStatus, string>> = {
  signale: '🏛️ Signalé à la mairie',
  mairie:  '✅ Marquer comme traité',
};

const EMOJI: Record<string, string> = { nid: '🫧', procession: '🐛' };

export function NestPopup({ nest, userLocation, onClose }: Props) {
  const [status, setStatus] = useState<NestStatus>(nest.status);
  const [updating, setUpdating] = useState(false);

  const distance = userLocation
    ? formatDistance(haversine(userLocation.latitude, userLocation.longitude, nest.latitude, nest.longitude))
    : null;

  const date = new Date(nest.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  async function handleStatusUpdate() {
    const next = NEXT_STATUS[status];
    if (!next) return;
    setUpdating(true);
    const { error } = await supabase.from('nests').update({ status: next }).eq('id', nest.id);
    if (error) Alert.alert('Erreur', 'Impossible de mettre à jour le statut.');
    else setStatus(next);
    setUpdating(false);
  }

  return (
    <View style={styles.popup}>
      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Title row */}
      <Text style={styles.titleRow}>
        <Text style={styles.emoji}>{EMOJI[nest.type] ?? '⚠️'} </Text>
        <Text style={styles.lieu}>{nest.lieu || 'Position sur carte'}</Text>
      </Text>

      {/* Meta */}
      <View style={styles.metaRow}>
        {distance && <Text style={styles.meta}>📍 {distance}</Text>}
        <Text style={styles.meta}>{date}</Text>
        <Badge status={status} />
      </View>

      {nest.description ? (
        <Text style={styles.description}>{nest.description}</Text>
      ) : null}

      {/* Status action */}
      {NEXT_LABEL[status] && (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleStatusUpdate}
          disabled={updating}
          activeOpacity={0.8}
        >
          <Text style={styles.actionLabel}>
            {updating ? '…' : NEXT_LABEL[status]}
          </Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
    minWidth: 190,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(26,14,6,.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 13, color: colors.bark + '80' },
  titleRow: { marginBottom: 8, paddingRight: 30 },
  emoji: { fontSize: 16 },
  lieu: { ...typography.h2, color: colors.bark },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 8 },
  meta: { fontFamily: 'DMMono-Regular', fontSize: 10, color: '#9a7e66' },
  description: { ...typography.body, color: '#6b5740', fontStyle: 'italic', marginBottom: 10, lineHeight: 18 },
  actionBtn: {
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(26,14,6,.15)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  actionLabel: { fontFamily: 'Fraunces-Regular', fontSize: 13, color: colors.bark },
});
