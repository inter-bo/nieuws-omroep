import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Niet gevonden' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Pagina niet gevonden</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Ga naar de startpagina</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: '#38a3a5',
    fontSize: 16,
  },
});
