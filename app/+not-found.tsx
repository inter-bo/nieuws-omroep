import { useMemo } from 'react';
import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export default function NotFoundScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

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

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: c.background,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: c.textPrimary,
    },
    link: {
      marginTop: 16,
    },
    linkText: {
      color: '#38a3a5',
      fontSize: 16,
    },
  });
}
