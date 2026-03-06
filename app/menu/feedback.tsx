import { useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

const CATEGORIES = ['Bug', 'Suggestie', 'Compliment', 'Anders'] as const;
type Category = typeof CATEGORIES[number];

export default function Feedback() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [bericht, setBericht] = useState('');
  const [category, setCategory] = useState<Category>('Suggestie');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!bericht.trim()) {
      Alert.alert('Fout', 'Vul een bericht in.');
      return;
    }
    const subject = encodeURIComponent(`Feedback Nieuws Omroep - ${category}`);
    const body = encodeURIComponent(`Naam: ${naam || '—'}\nEmail: ${email || '—'}\n\n${bericht}`);
    Linking.openURL(`mailto:feedback@nieuwsomroep.nl?subject=${subject}&body=${body}`).catch(() =>
      Alert.alert('Fout', 'Kan e-mail app niet openen.')
    );
    setSubmitted(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.textLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Feedback</Text>
        <View style={{ width: 24 }} />
      </View>
      {submitted ? (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#27AE60" />
          <Text style={styles.successTitle}>Bedankt!</Text>
          <Text style={styles.successText}>Je feedback is verstuurd via je e-mailapp.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Terug</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Categorie</Text>
          <View style={styles.segments}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.segment, category === cat && styles.segmentActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.segmentText, category === cat && styles.segmentTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Naam (optioneel)</Text>
          <TextInput
            style={styles.input}
            value={naam}
            onChangeText={setNaam}
            placeholder="Jouw naam"
            placeholderTextColor={theme.textMuted}
          />

          <Text style={styles.label}>E-mail (optioneel)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="jouw@email.nl"
            placeholderTextColor={theme.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Bericht *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={bericht}
            onChangeText={setBericht}
            placeholder="Schrijf hier je bericht..."
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Verstuur Feedback</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: c.primary,
      gap: 12,
    },
    title: {
      flex: 1,
      color: c.textLight,
      fontSize: 18,
      fontWeight: '700',
    },
    form: {
      padding: 20,
      gap: 8,
      paddingBottom: 40,
    },
    label: {
      color: c.textSecondary,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: c.backgroundSecondary,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 10,
      color: c.textPrimary,
      fontSize: 15,
    },
    textarea: {
      minHeight: 120,
      paddingTop: 12,
    },
    segments: {
      flexDirection: 'row',
      gap: 6,
      flexWrap: 'wrap',
    },
    segment: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
    },
    segmentActive: {
      backgroundColor: '#38a3a5',
      borderColor: '#38a3a5',
    },
    segmentText: {
      color: c.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    segmentTextActive: {
      color: '#fff',
    },
    submitBtn: {
      marginTop: 20,
      backgroundColor: '#38a3a5',
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    submitText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
    successContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      gap: 12,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: c.textPrimary,
    },
    successText: {
      fontSize: 15,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 22,
    },
    backBtn: {
      marginTop: 16,
      backgroundColor: c.backgroundSecondary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    backBtnText: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
  });
}
