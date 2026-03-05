import { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Badge } from '@/components/Badge';
import { supabase } from '@/lib/supabase';
import { useNests } from '@/hooks/useNests';
import type { Nest, NestStatus } from '@/lib/types';

const PIN_KEY = 'chenilles_moderation_pin';
const DEFAULT_PIN = '1234';
const EMOJI: Record<string, string> = { nid: '🫧', procession: '🐛' };

type Filter = 'signale' | 'mairie' | 'traite' | 'rejete';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'signale', label: 'Signalés' },
  { key: 'mairie',  label: 'En cours' },
  { key: 'traite',  label: 'Traités'  },
  { key: 'rejete',  label: 'Rejetés'  },
];

// Session unlocked persiste tant que le module est chargé (durée de vie de l'app)
let sessionUnlocked = false;

// ─────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────

export default function ModerationScreen() {
  const [unlocked, setUnlocked] = useState(sessionUnlocked);

  if (!unlocked) {
    return <PinScreen onSuccess={() => { sessionUnlocked = true; setUnlocked(true); }} />;
  }

  return <ModerationDashboard onLock={() => { sessionUnlocked = false; setUnlocked(false); }} />;
}

// ─────────────────────────────────────────────
// Écran PIN
// ─────────────────────────────────────────────

function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [digits, setDigits] = useState('');
  const [error, setError] = useState(false);
  const [isFirst, setIsFirst] = useState(false);

  // Vérifie si un PIN a déjà été défini
  useState(() => {
    SecureStore.getItemAsync(PIN_KEY).then((v) => { if (!v) setIsFirst(true); });
  });

  function press(d: string) {
    if (digits.length >= 4) return;
    const next = digits + d;
    setDigits(next);
    setError(false);
    if (next.length === 4) validate(next);
  }

  function del() {
    setDigits((p) => p.slice(0, -1));
    setError(false);
  }

  async function validate(code: string) {
    const stored = (await SecureStore.getItemAsync(PIN_KEY)) ?? DEFAULT_PIN;
    if (code === stored) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setDigits(''), 600);
    }
  }

  return (
    <View style={pinStyles.container}>
      <Text style={pinStyles.title}>🏛️ Accès Mairie</Text>
      <Text style={pinStyles.subtitle}>Code confidentiel</Text>

      {isFirst && (
        <Text style={pinStyles.hint}>Code par défaut : {DEFAULT_PIN}</Text>
      )}

      {/* Dots */}
      <View style={pinStyles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              pinStyles.dot,
              digits.length > i && pinStyles.dotFilled,
              error && pinStyles.dotError,
            ]}
          />
        ))}
      </View>

      {/* Keypad */}
      <View style={pinStyles.keypad}>
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
          <TouchableOpacity
            key={i}
            style={[pinStyles.key, k === '' && pinStyles.keyEmpty]}
            onPress={() => k === '⌫' ? del() : k !== '' ? press(k) : null}
            disabled={k === ''}
            activeOpacity={0.7}
          >
            <Text style={pinStyles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// Dashboard modération
// ─────────────────────────────────────────────

function ModerationDashboard({ onLock }: { onLock: () => void }) {
  const { nests, loading, refresh } = useNests({ includeRejected: true });
  const [filter, setFilter] = useState<Filter>('signale');
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = nests.filter((n) => n.status === filter);

  async function setStatus(nest: Nest, next: NestStatus) {
    setUpdating(nest.id);
    const { error } = await supabase.from('nests').update({ status: next }).eq('id', nest.id);
    if (error) Alert.alert('Erreur', 'Mise à jour impossible.');
    else await refresh();
    setUpdating(null);
  }

  function confirmAction(nest: Nest, next: NestStatus, label: string) {
    Alert.alert(label, `${EMOJI[nest.type]} ${nest.lieu}`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', onPress: () => setStatus(nest, next) },
    ]);
  }

  function renderActions(nest: Nest) {
    switch (nest.status) {
      case 'signale':
        return (
          <View style={dash.actions}>
            <ActionBtn label="🏛️ Mairie" color={colors.amber} onPress={() => confirmAction(nest, 'mairie', 'Signaler à la mairie')} />
            <ActionBtn label="✅ Traité"  color={colors.green} onPress={() => confirmAction(nest, 'traite', 'Marquer comme traité')} />
            <ActionBtn label="✗ Rejeter" color="#9CA3AF"      onPress={() => confirmAction(nest, 'rejete', 'Rejeter le signalement')} />
          </View>
        );
      case 'mairie':
        return (
          <View style={dash.actions}>
            <ActionBtn label="✅ Traité"  color={colors.green} onPress={() => confirmAction(nest, 'traite', 'Marquer comme traité')} />
            <ActionBtn label="✗ Rejeter" color="#9CA3AF"      onPress={() => confirmAction(nest, 'rejete', 'Rejeter le signalement')} />
          </View>
        );
      case 'traite':
      case 'rejete':
        return (
          <View style={dash.actions}>
            <ActionBtn label="↩ Réouvrir" color={colors.red} onPress={() => confirmAction(nest, 'signale', 'Réouvrir le signalement')} />
          </View>
        );
    }
  }

  return (
    <View style={dash.container}>
      {/* Header */}
      <View style={dash.header}>
        <Text style={dash.headerTitle}>🏛️ Modération</Text>
        <TouchableOpacity onPress={onLock} style={dash.lockBtn}>
          <Text style={dash.lockText}>🔒</Text>
        </TouchableOpacity>
      </View>

      {/* Compteurs + filtres */}
      <View style={dash.filters}>
        {FILTERS.map((f) => {
          const count = nests.filter((n) => n.status === f.key).length;
          return (
            <TouchableOpacity
              key={f.key}
              style={[dash.filterBtn, filter === f.key && dash.filterBtnActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[dash.filterLabel, filter === f.key && dash.filterLabelActive]}>
                {f.label}
              </Text>
              {count > 0 && (
                <View style={dash.badge}>
                  <Text style={dash.badgeText}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Liste */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.moss} />
      ) : filtered.length === 0 ? (
        <Text style={dash.empty}>Aucun signalement dans cette catégorie.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(n) => n.id}
          renderItem={({ item }) => (
            <View style={dash.card}>
              <View style={dash.cardTop}>
                <Text style={dash.cardLieu} numberOfLines={1}>
                  {EMOJI[item.type]} {item.lieu}
                </Text>
                <Badge status={item.status} />
              </View>
              {item.description ? (
                <Text style={dash.cardDesc} numberOfLines={2}>{item.description}</Text>
              ) : null}
              <Text style={dash.cardDate}>
                {new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                {'  ·  '}
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </Text>
              {updating === item.id
                ? <ActivityIndicator size="small" color={colors.moss} style={{ marginTop: 8 }} />
                : renderActions(item)
              }
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          onRefresh={refresh}
          refreshing={loading}
        />
      )}
    </View>
  );
}

function ActionBtn({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[dash.actionBtn, { borderColor: color }]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[dash.actionLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const pinStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: { ...typography.h1, color: colors.bark, marginBottom: 6 },
  subtitle: { fontFamily: 'DMMono-Regular', fontSize: 12, color: colors.bark + '80', marginBottom: 24 },
  hint: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    color: colors.moss,
    marginBottom: 20,
    backgroundColor: '#EDF4EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dots: { flexDirection: 'row', gap: 16, marginBottom: 36 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.moss,
    backgroundColor: 'transparent',
  },
  dotFilled:  { backgroundColor: colors.moss },
  dotError:   { borderColor: colors.red, backgroundColor: colors.red },
  keypad:     { flexDirection: 'row', flexWrap: 'wrap', width: 220, gap: 12 },
  key: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  keyEmpty: { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  keyText:  { fontFamily: 'Fraunces-SemiBold', fontSize: 22, color: colors.bark },
});

const dash = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.cream },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle:{ ...typography.h2, color: colors.bark },
  lockBtn:    { padding: 8 },
  lockText:   { fontSize: 18 },
  filters:    { flexDirection: 'row', paddingHorizontal: 12, gap: 6, marginBottom: 8 },
  filterBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.moss + '40',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  filterBtnActive: { backgroundColor: colors.moss, borderColor: colors.moss },
  filterLabel:      { fontFamily: 'DMMono-Regular', fontSize: 10, color: colors.bark },
  filterLabelActive:{ color: colors.cream },
  badge: {
    backgroundColor: colors.red,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontFamily: 'DMMono-Regular', fontSize: 9, color: '#fff', fontWeight: '700' },
  empty: { fontFamily: 'DMMono-Regular', fontSize: 12, color: colors.bark + '60', textAlign: 'center', marginTop: 48 },
  card: {
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardLieu:  { ...typography.body, fontFamily: 'Fraunces-SemiBold', color: colors.bark, flex: 1, marginRight: 8 },
  cardDesc:  { fontFamily: 'DMMono-Regular', fontSize: 11, color: '#6b5740', fontStyle: 'italic', marginBottom: 6 },
  cardDate:  { fontFamily: 'DMMono-Regular', fontSize: 10, color: '#9a7e66', marginBottom: 10 },
  actions:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { borderWidth: 1.5, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  actionLabel:{ fontFamily: 'DMMono-Regular', fontSize: 11, fontWeight: '600' },
});
