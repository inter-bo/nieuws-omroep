import { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Pressable, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useDrawer } from '@/context/DrawerContext';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

const DRAWER_WIDTH = 280;

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export function Drawer() {
  const { isOpen, close } = useDrawer();
  const router = useRouter();
  const theme = useTheme();

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  // FIX: store running animation so it can be stopped on cleanup — prevents native crash
  // when the component unmounts mid-spring (e.g., rapid navigation away during drawer open)
  const activeAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const anim = isOpen
      ? Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            damping: 20,
            stiffness: 200,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      : Animated.parallel([
          Animated.spring(translateX, {
            toValue: -DRAWER_WIDTH,
            damping: 20,
            stiffness: 200,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);
    activeAnimationRef.current = anim;
    anim.start();
    return () => {
      // FIX: stop any in-flight animation to prevent updating detached native views
      activeAnimationRef.current?.stop();
    };
  }, [isOpen]);

  function handleRateApp() {
    const pkg = Constants.expoConfig?.android?.package ?? 'com.yourcompany.nieuwsomroep';
    const url =
      Platform.OS === 'android'
        ? `market://details?id=${pkg}`
        : `https://apps.apple.com/app/id000000000`;
    Linking.openURL(url).catch(() => {});
    close();
  }

  function navigate(path: string) {
    router.push(path as any);
    close();
  }

  const menuItems: MenuItem[] = [
    {
      icon: 'newspaper-outline',
      label: 'Nieuws Bronnen',
      onPress: () => navigate('/menu/nieuws-bronnen'),
    },
    {
      icon: 'star-outline',
      label: 'Favorieten',
      onPress: () => navigate('/menu/favorieten-beheer'),
    },
    {
      icon: 'chatbubble-outline',
      label: 'Feedback',
      onPress: () => navigate('/menu/feedback'),
    },
    {
      icon: 'star-half-outline',
      label: 'Beoordeel de App',
      onPress: handleRateApp,
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Privacybeleid',
      onPress: () => navigate('/menu/privacy-policy'),
    },
    {
      icon: 'document-text-outline',
      label: 'Gebruikersovereenkomst',
      onPress: () => navigate('/menu/gebruikersovereenkomst'),
    },
  ];

  // Always rendered — visibility controlled via pointerEvents + animation
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={isOpen ? 'box-none' : 'none'}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>
      <Animated.View style={[styles.drawer, { backgroundColor: theme.backgroundSecondary }, { transform: [{ translateX }] }]}>
        <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.drawerTitle, { color: theme.textPrimary }]}>Menu</Text>
          <TouchableOpacity onPress={close} hitSlop={8}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={22} color={theme.textSecondary} style={styles.menuIcon} />
            <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    paddingTop: 60,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 2, height: 0 },
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});
