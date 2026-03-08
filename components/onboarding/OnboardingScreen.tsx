import { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch } from '@/store';
import { setHasSeenOnboarding } from '@/store/slices/settingsSlice';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';
import Logo from '@/assets/images/logo.svg';

interface Slide {
  key: string;
  title: string;
  subtitle: string;
  icon: 'logo' | 'newspaper-outline' | 'star-outline';
}

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    title: 'Welkom bij Nieuws Omroep',
    subtitle: 'Al het Nederlandse nieuws op één plek',
    icon: 'logo',
  },
  {
    key: 'provinces',
    title: 'Nieuws per provincie',
    subtitle: 'Swipe tussen provincies en volg het nieuws uit jouw regio',
    icon: 'newspaper-outline',
  },
  {
    key: 'favorites',
    title: 'Jouw nieuws, jouw keuze',
    subtitle: 'Voeg bronnen toe aan je favorieten en stel je eigen nieuwsfeed in',
    icon: 'star-outline',
  },
];

export function OnboardingScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function complete() {
    dispatch(setHasSeenOnboarding());
  }

  function goNext() {
    const next = activeIndex + 1;
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setActiveIndex(next);
  }

  const isLast = activeIndex === SLIDES.length - 1;
  const showSkip = activeIndex < SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top bar — skip link */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        {showSkip && (
          <TouchableOpacity onPress={complete} hitSlop={12}>
            <Text style={styles.skipText}>Overslaan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.pager}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <View style={styles.iconWrapper}>
              {slide.icon === 'logo' ? (
                <Logo width={200} height={54} />
              ) : (
                <Ionicons name={slide.icon} size={80} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom — dots + button */}
      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View key={slide.key} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={isLast ? complete : goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {isLast ? 'Aan de slag' : 'Volgende'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.primary,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: 48,
    },
    skipText: {
      color: c.textSecondary,
      fontSize: 14,
    },
    pager: {
      flex: 1,
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 20,
    },
    iconWrapper: {
      marginBottom: 8,
    },
    title: {
      color: c.textLight,
      fontSize: 26,
      fontWeight: '700',
      textAlign: 'center',
    },
    subtitle: {
      color: c.textSecondary,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
    },
    bottom: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      paddingTop: 16,
      gap: 20,
      alignItems: 'center',
    },
    dots: {
      flexDirection: 'row',
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.35)',
    },
    dotActive: {
      backgroundColor: '#FFFFFF',
    },
    button: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: c.primary,
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
