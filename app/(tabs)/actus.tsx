import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { colors } from '@/constants/colors';
import { ACTUS } from '@/lib/actus';
import type { Article } from '@/lib/types';

const TAG_STYLE: Record<Article['tag'], { bg: string; text: string }> = {
  saison:     { bg: '#FEF3C7', text: '#92400E' },
  feature:    { bg: '#DBEAFE', text: '#1E40AF' },
  info:       { bg: '#D1FAE5', text: '#065F46' },
  communaute: { bg: '#F3E8FF', text: '#6B21A8' },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function ActusScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Vernègues · Bouches-du-Rhône</Text>
        <Text style={styles.heroTitle}>Actus &amp; infos locales</Text>
        <Text style={styles.heroSub}>Droits, contacts mairie, gestes d'urgence</Text>
      </View>

      {/* Support card */}
      <View style={styles.supportCard}>
        <View style={styles.supportTop}>
          <Text style={styles.supportEmoji}>☕</Text>
          <View style={styles.supportTexts}>
            <Text style={styles.supportTitle}>Soutenir le projet</Text>
            <Text style={styles.supportDesc}>
              Cette app est faite par un habitant de Vernègues, gratuitement, pour protéger nos chiens,
              nos enfants et nos voisins. Si elle vous est utile, vous pouvez aider à couvrir les frais
              de mise en ligne.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.coffeeBtn}
          onPress={() => Linking.openURL('https://ko-fi.com')}
          activeOpacity={0.85}
        >
          <Text style={styles.coffeeBtnText}>☕ Offrir un café</Text>
        </TouchableOpacity>
        <Text style={styles.coffeeSub}>Via Ko-fi — libre et sans obligation. Merci 🙏</Text>
      </View>

      {/* Section label */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>Dernières actus</Text>
        <View style={styles.sectionLine} />
      </View>

      {/* Articles */}
      {ACTUS.map((article, i) => {
        const tag = TAG_STYLE[article.tag];
        const isOpen = expanded === article.id;
        return (
          <TouchableOpacity
            key={article.id}
            style={styles.card}
            onPress={() => setExpanded(isOpen ? null : article.id)}
            activeOpacity={0.85}
          >
            <View style={styles.cardInner}>
              <View style={styles.cardTop}>
                <View style={[styles.tag, { backgroundColor: tag.bg }]}>
                  <Text style={[styles.tagText, { color: tag.text }]}>{article.tag_label}</Text>
                </View>
                <Text style={styles.cardDate}>{fmtDate(article.created_at)}</Text>
              </View>
              <Text style={styles.cardTitle}>{article.title}</Text>
              <Text style={styles.cardExcerpt}>{article.excerpt}</Text>
              {i === 0 && (
                <View style={styles.newBadge}>
                  <View style={styles.newDot} />
                  <Text style={styles.newText}>Nouveau</Text>
                </View>
              )}
            </View>
            {isOpen && (
              <View style={styles.expanded}>
                <Text style={styles.body}>{article.body}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: 20 },

  hero: { backgroundColor: colors.bark, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 20 },
  heroLabel: {
    fontFamily: 'DMMono-Regular', fontSize: 10, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 1, color: colors.lichen, marginBottom: 6,
  },
  heroTitle: { fontFamily: 'Fraunces-SemiBold', fontSize: 20, color: colors.cream, marginBottom: 4 },
  heroSub: { fontFamily: 'Fraunces-Regular', fontSize: 12, color: 'rgba(246,241,228,.55)', fontStyle: 'italic' },

  supportCard: {
    margin: 16, marginBottom: 4, backgroundColor: '#fff',
    borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(26,14,6,.08)', padding: 16,
  },
  supportTop: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  supportEmoji: { fontSize: 32, lineHeight: 36 },
  supportTexts: { flex: 1 },
  supportTitle: { fontFamily: 'Fraunces-SemiBold', fontSize: 15, color: colors.bark, marginBottom: 3 },
  supportDesc: { fontFamily: 'Fraunces-Regular', fontSize: 12, color: '#7a6248', lineHeight: 18, fontStyle: 'italic' },
  coffeeBtn: {
    backgroundColor: colors.bark, borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', marginBottom: 8,
  },
  coffeeBtnText: { fontFamily: 'Fraunces-SemiBold', fontSize: 14, color: colors.cream },
  coffeeSub: { fontFamily: 'Fraunces-Regular', fontSize: 11, color: '#9a7e66', textAlign: 'center', fontStyle: 'italic' },

  sectionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10,
  },
  sectionLabel: {
    fontFamily: 'DMMono-Regular', fontSize: 11, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8, color: '#8a7060', marginRight: 8,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(26,14,6,.1)' },

  card: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff',
    borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(26,14,6,.08)', overflow: 'hidden',
  },
  cardInner: { padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  tagText: {
    fontFamily: 'DMMono-Regular', fontSize: 10, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  cardDate: { fontFamily: 'DMMono-Regular', fontSize: 10, color: '#9a7e66' },
  cardTitle: { fontFamily: 'Fraunces-SemiBold', fontSize: 14, color: colors.bark, lineHeight: 19, marginBottom: 5 },
  cardExcerpt: { fontFamily: 'Fraunces-Regular', fontSize: 12, color: '#6b5740', lineHeight: 17, fontStyle: 'italic' },
  newBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  newDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.red },
  newText: { fontFamily: 'DMMono-Regular', fontSize: 10, fontWeight: '600', color: colors.red },
  expanded: { borderTopWidth: 1, borderTopColor: 'rgba(26,14,6,.07)', padding: 16, paddingTop: 12 },
  body: { fontFamily: 'Fraunces-Regular', fontSize: 13, color: '#3d2a1a', lineHeight: 22 },
});
