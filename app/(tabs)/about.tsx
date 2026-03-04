import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Over Nieuws Omroep</Text>
          
          <View style={styles.section}>
            <Text style={styles.text}>
              Nieuws Omroep is dé app voor al het regionale nieuws uit Nederland. 
              Wij brengen je het laatste nieuws van alle regionale omroepen op één plek samen.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Onze Missie</Text>
            <Text style={styles.text}>
              Onze missie is om regionale journalistiek toegankelijker te maken en 
              mensen te verbinden met het nieuws uit hun regio.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>• Nieuws van alle regionale omroepen</Text>
              <Text style={styles.featureItem}>• Swipen tussen provincies</Text>
              <Text style={styles.featureItem}>• Eenvoudig filteren per provincie</Text>
              <Text style={styles.featureItem}>• Persoonlijke nieuwsfeed</Text>
              <Text style={styles.featureItem}>• Favoriete artikelen opslaan</Text>
              <Text style={styles.featureItem}>• Delen van nieuwsartikelen</Text>
              <Text style={styles.featureItem}>• Offline lezen</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.text}>
              Voor vragen, suggesties of feedback kunt u contact met ons opnemen via het feedback formulier.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>Versie 0.9.9</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#38a3a5',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 8,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 28,
  },
  link: {
    color: '#38a3a5',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
}); 