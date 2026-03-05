import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type Article = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

export default function ActusScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setArticles(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.lichen} size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<InfoCard />}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.article}
          onPress={() => setExpanded(expanded === item.id ? null : item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.articleTitle}>{item.title}</Text>
          <Text style={styles.articleDate}>
            {new Date(item.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          {expanded === item.id && (
            <Text style={styles.articleBody}>{item.body}</Text>
          )}
        </TouchableOpacity>
      )}
      ListFooterComponent={<SupportCard />}
    />
  );
}

function InfoCard() {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>Contact mairie de Vernègues</Text>
      <TouchableOpacity onPress={() => Linking.openURL('tel:0490593001')}>
        <Text style={styles.infoPhone}>📞 04 90 59 30 01</Text>
      </TouchableOpacity>
      <Text style={styles.infoBody}>
        Le maire est tenu d'intervenir sur les nids situés sur le domaine public (art. L.2212-2 CGCT).
        La chenille processionnaire est classée nuisible à la santé humaine depuis le décret n°2022-686.
      </Text>
    </View>
  );
}

function SupportCard() {
  return (
    <TouchableOpacity
      style={styles.supportCard}
      onPress={() => Linking.openURL('https://ko-fi.com')}
      activeOpacity={0.8}
    >
      <Text style={styles.supportTitle}>Soutenir le projet ☕</Text>
      <Text style={styles.supportBody}>
        Cette app est gratuite et sans pub. Si elle vous est utile, un petit café sur Ko-fi est toujours bienvenu !
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cream },
  list: { padding: 16, gap: 12, backgroundColor: colors.cream },
  infoCard: {
    backgroundColor: colors.moss + '20',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.moss,
    marginBottom: 4,
  },
  infoTitle: { ...typography.h2, color: colors.bark, marginBottom: 6 },
  infoPhone: {
    fontFamily: 'DMMono-Regular',
    fontSize: 16,
    color: colors.moss,
    marginBottom: 8,
  },
  infoBody: { ...typography.body, color: colors.bark + 'CC' },
  article: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bark + '20',
  },
  articleTitle: { ...typography.h2, color: colors.bark, marginBottom: 4 },
  articleDate: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    color: colors.bark + '60',
    marginBottom: 8,
  },
  articleBody: { ...typography.body, color: colors.bark + 'CC', marginTop: 8 },
  supportCard: {
    backgroundColor: colors.amber + '20',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.amber,
    marginTop: 4,
  },
  supportTitle: { ...typography.h2, color: colors.bark, marginBottom: 6 },
  supportBody: { ...typography.body, color: colors.bark + 'CC' },
});
