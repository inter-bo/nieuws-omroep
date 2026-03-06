import { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

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
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.toolbarButton}
          accessibilityLabel="Terug"
        >
          <Ionicons name="arrow-back" size={24} color={theme.textLight} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.toolbarButton}
          accessibilityLabel="Delen"
        >
          <Ionicons name="share-outline" size={24} color={theme.textLight} />
        </TouchableOpacity>
      </View>

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
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
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 6,
      backgroundColor: c.primary,
    },
    toolbarButton: {
      padding: 8,
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
