import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export function Button({ label, onPress, loading, variant = 'primary', style }: Props) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[styles.base, isPrimary ? styles.primary : styles.secondary, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.cream : colors.moss} size="small" />
      ) : (
        <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.moss },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.moss,
  },
  label: { fontFamily: 'Fraunces-SemiBold', fontSize: 15 },
  labelPrimary: { color: colors.cream },
  labelSecondary: { color: colors.moss },
});
