import { ArticleViewer } from '@/components/news/ArticleViewer';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function ArticleScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const decodedUrl = url ? decodeURIComponent(url) : '';
  
  if (!decodedUrl) {
    return null;
  }
  
  return (
    <View style={{ flex: 1 }}>
      <ArticleViewer url={decodedUrl} />
    </View>
  );
} 