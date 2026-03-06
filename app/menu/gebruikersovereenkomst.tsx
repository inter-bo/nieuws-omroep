import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export default function Gebruikersovereenkomst() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.textLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Gebruikersovereenkomst</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Laatste update: maart 2025</Text>

        <Text style={styles.heading}>1. Gebruik van de app</Text>
        <Text style={styles.body}>
          Nieuws Omroep is een gratis nieuwsaggregator voor regionaal nieuws in Nederland.
          Door gebruik te maken van de app gaat u akkoord met deze gebruikersovereenkomst.
        </Text>

        <Text style={styles.heading}>2. Inhoud van derden</Text>
        <Text style={styles.body}>
          De app toont nieuws afkomstig van publieke RSS-feeds van regionale omroepen en
          nieuwsorganisaties. Nieuws Omroep is niet verantwoordelijk voor de juistheid,
          volledigheid of actualiteit van de getoonde inhoud. Alle auteursrechten berusten
          bij de respectievelijke nieuwsorganisaties.
        </Text>

        <Text style={styles.heading}>3. Beperking van aansprakelijkheid</Text>
        <Text style={styles.body}>
          Nieuws Omroep is op geen enkele wijze aansprakelijk voor schade die voortvloeit
          uit het gebruik van de app of de beschikbaarheid dan wel onbeschikbaarheid van
          nieuwsbronnen.
        </Text>

        <Text style={styles.heading}>4. Intellectueel eigendom</Text>
        <Text style={styles.body}>
          De applicatie zelf, inclusief design en code, is eigendom van de ontwikkelaar.
          De nieuwsinhoud is eigendom van de respectievelijke uitgevers. Het is niet
          toegestaan de app te kopiëren, distribueren of aan te passen zonder toestemming.
        </Text>

        <Text style={styles.heading}>5. Wijzigingen</Text>
        <Text style={styles.body}>
          Nieuws Omroep behoudt zich het recht voor deze overeenkomst te wijzigen. Wijzigingen
          worden van kracht na publicatie in de app of in de app store.
        </Text>

        <Text style={styles.heading}>6. Toepasselijk recht</Text>
        <Text style={styles.body}>
          Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden
          voorgelegd aan de bevoegde rechter in Nederland.
        </Text>

        <Text style={styles.heading}>7. Contact</Text>
        <Text style={styles.body}>
          Vragen over deze overeenkomst? Neem contact op via:{'\n'}
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
