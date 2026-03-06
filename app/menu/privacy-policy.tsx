import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export default function PrivacyPolicy() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.textLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacybeleid</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Laatste update: maart 2025</Text>

        <Text style={styles.heading}>1. Geen persoonlijke gegevens</Text>
        <Text style={styles.body}>
          Nieuws Omroep slaat geen persoonlijke gegevens op. De app verzamelt geen naam, e-mailadres,
          locatiegegevens of andere identificeerbare informatie van gebruikers.
        </Text>

        <Text style={styles.heading}>2. RSS-feeds</Text>
        <Text style={styles.body}>
          De app toont nieuws via publiek toegankelijke RSS-feeds van regionale omroepen en
          nieuwsorganisaties. Deze feeds zijn vrij beschikbaar op het internet. Nieuws Omroep
          is niet verantwoordelijk voor de inhoud van externe nieuwsbronnen.
        </Text>

        <Text style={styles.heading}>3. Lokale opslag</Text>
        <Text style={styles.body}>
          Instellingen zoals favoriete bronnen en weergavevoorkeuren worden uitsluitend lokaal
          op uw apparaat opgeslagen via AsyncStorage. Deze gegevens verlaten uw apparaat niet
          en worden niet gedeeld met derden.
        </Text>

        <Text style={styles.heading}>4. Geen tracking of analytics</Text>
        <Text style={styles.body}>
          Nieuws Omroep maakt geen gebruik van analytics, tracking-tools, advertenties of
          vergelijkbare technologieën. Uw gebruik van de app wordt niet bijgehouden.
        </Text>

        <Text style={styles.heading}>5. Internetverbinding</Text>
        <Text style={styles.body}>
          De app maakt verbinding met externe servers uitsluitend om nieuws te laden van de
          geselecteerde RSS-feeds. Er worden geen gebruikersgegevens naar deze servers gestuurd.
        </Text>

        <Text style={styles.heading}>6. Contact</Text>
        <Text style={styles.body}>
          Heeft u vragen over dit privacybeleid? Stuur een e-mail naar:{'\n'}
          feedback@nieuwsomroep.nl
        </Text>
      </ScrollView>
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
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    updated: {
      color: c.textMuted,
      fontSize: 13,
      marginBottom: 20,
    },
    heading: {
      color: c.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      marginTop: 20,
      marginBottom: 8,
    },
    body: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 22,
    },
  });
}
