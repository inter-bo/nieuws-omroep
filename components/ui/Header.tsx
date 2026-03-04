import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const navItems = [
  { icon: 'home', label: 'Home', route: '/' },
  { icon: 'heart', label: 'Favorieten', route: '/favorites' },
  { icon: 'settings', label: 'Instellingen', route: '/settings' },
  { icon: 'information-circle', label: 'Over', route: '/about' },
] as const;

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.includes('/article/')) return null;

  function isActive(route: string) {
    if (route === '/') return pathname === '/' || pathname === '/index';
    return pathname.startsWith(route);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoRow}>
          <Ionicons name="newspaper" size={22} color="#38a3a5" />
          <Text style={styles.title}>Nieuws Omroep</Text>
        </View>
        <View style={styles.nav}>
          {navItems.map((item) => {
            const active = isActive(item.route);
            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.push(item.route)}
                style={styles.navButton}
                accessibilityLabel={item.label}
              >
                <Ionicons
                  name={active ? item.icon : (`${item.icon}-outline` as any)}
                  size={22}
                  color={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  nav: {
    flexDirection: 'row',
    gap: 2,
  },
  navButton: {
    padding: 8,
  },
});
