import { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useDrawer } from '@/context/DrawerContext';
import { Colors } from '@/constants/Colors';
import Logo from '@/assets/images/logo.svg';

export function Header() {
  const pathname = usePathname();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { open } = useDrawer();

  if (pathname.includes('/article/')) return null;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={open} style={styles.menuButton} accessibilityLabel="Menu openen">
          <Ionicons name="menu" size={26} color={theme.textLight} />
        </TouchableOpacity>
        <View style={styles.logoWrapper}>
          <Logo width={140} height={36} />
        </View>
        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
}

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: c.primary,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: c.primary,
    },
    menuButton: {
      padding: 6,
      width: 42,
    },
    logoWrapper: {
      flex: 1,
      alignItems: 'center',
    },
    spacer: {
      width: 42,
    },
  });
}
