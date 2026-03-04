import { ArticleViewer } from '@/components/news/ArticleViewer';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function ArticleScreen() {
  const params = useLocalSearchParams();
  const url = Array.isArray(params.article) 
    ? params.article[0] 
    : typeof params.url === 'string' 
      ? params.url 
      : null;
  
  if (!url) {
    return null;
  }
  
  return (
    <View style={{ flex: 1 }}>
      <ArticleViewer url={url} />
    </View>
  );
} 