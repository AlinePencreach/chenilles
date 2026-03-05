import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { getDeviceId } from '@/lib/deviceId';

type NestType = 'nid' | 'procession';

const VERNEGUES = {
  latitude: 43.6478,
  longitude: 5.2394,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function SignalerScreen() {
  const [type, setType] = useState<NestType>('nid');
  const [lieu, setLieu] = useState('');
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleMapPress(e: MapPressEvent) {
    setCoords(e.nativeEvent.coordinate);
  }

  async function handleSubmit() {
    if (!lieu.trim()) {
      Alert.alert('Lieu manquant', 'Merci d\'indiquer un lieu (ex: chemin des Oliviers).');
      return;
    }
    if (!coords) {
      Alert.alert('Position manquante', 'Tapez sur la carte pour placer le nid.');
      return;
    }

    setSubmitting(true);
    try {
      const deviceId = await getDeviceId();
      const { error } = await supabase.from('nests').insert({
        type,
        lieu: lieu.trim(),
        description: description.trim() || null,
        latitude: coords.latitude,
        longitude: coords.longitude,
        status: 'signale',
        device_id: deviceId,
      });

      if (error) throw error;

      Alert.alert('Merci !', 'Votre signalement a bien été enregistré.', [
        {
          text: 'OK',
          onPress: () => {
            setLieu('');
            setDescription('');
            setCoords(null);
            setType('nid');
          },
        },
      ]);
    } catch {
      Alert.alert('Erreur', 'Impossible d\'enregistrer le signalement. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Signaler un nid</Text>

        {/* Type */}
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'nid' && styles.typeBtnActive]}
            onPress={() => setType('nid')}
          >
            <Text style={styles.typeBtnText}>🫧 Nid dans un arbre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'procession' && styles.typeBtnActive]}
            onPress={() => setType('procession')}
          >
            <Text style={styles.typeBtnText}>🐛 Procession au sol</Text>
          </TouchableOpacity>
        </View>

        {/* Lieu */}
        <Text style={styles.label}>Lieu *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: chemin des Oliviers, près du pin parasol"
          placeholderTextColor={colors.bark + '60'}
          value={lieu}
          onChangeText={setLieu}
        />

        {/* Description */}
        <Text style={styles.label}>Description (optionnelle)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Hauteur du nid, taille de la procession…"
          placeholderTextColor={colors.bark + '60'}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Carte */}
        <Text style={styles.label}>Position sur la carte *</Text>
        <Text style={styles.hint}>Tapez sur la carte pour placer le nid</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={VERNEGUES}
            onPress={handleMapPress}
          >
            {coords && (
              <Marker coordinate={coords} pinColor={colors.red} />
            )}
          </MapView>
        </View>

        <Button
          label="Envoyer le signalement"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  title: {
    ...typography.h1,
    color: colors.bark,
    marginBottom: 24,
  },
  label: {
    ...typography.label,
    color: colors.bark,
    marginBottom: 6,
    marginTop: 16,
  },
  hint: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    color: colors.bark + '80',
    marginBottom: 8,
  },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.moss,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: colors.moss,
  },
  typeBtnText: {
    fontFamily: 'Fraunces-Regular',
    fontSize: 13,
    color: colors.bark,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.moss,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Fraunces-Regular',
    fontSize: 15,
    color: colors.bark,
    backgroundColor: '#fff',
  },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.moss,
  },
  map: { flex: 1 },
  submitBtn: { marginTop: 28 },
});
