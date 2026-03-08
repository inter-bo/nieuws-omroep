import { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';
import Logo from '@/assets/images/logo.svg';

interface Props {
  url: string;
}

export function ArticleViewer({ url }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [isLoading, setIsLoading] = useState(true);

  async function handleShare() {
    try {
      await Share.share({ message: url, url });
    } catch {
      // share cancelled or unavailable
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.toolbarWrapper}>
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.toolbarButton}
            accessibilityLabel="Terug"
          >
            <Ionicons name="arrow-back" size={24} color={theme.textLight} />
          </TouchableOpacity>
          <View style={styles.logoWrapper}>
            <Logo width={216} height={58} />
          </View>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.toolbarButton}
            accessibilityLabel="Delen"
          >
            <Ionicons name="share-outline" size={24} color={theme.textLight} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        // FIX: on iOS, failed WebView navigations fire onError instead of onLoadEnd —
        // without this, isLoading stays true and the overlay blocks the screen forever
        onError={() => setIsLoading(false)}
      />

      {isLoading && (
        <View style={[styles.loadingOverlay, { pointerEvents: 'none' }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
    </View>
  );
}

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.primary,
    },
    toolbarWrapper: {
      backgroundColor: c.primary,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 10,
      backgroundColor: c.primary,
    },
    toolbarButton: {
      padding: 8,
      width: 40,
    },
    logoWrapper: {
      flex: 1,
      alignItems: 'center',
    },
    webview: {
      flex: 1,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.6)',
    },
  });
}
