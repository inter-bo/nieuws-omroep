import { ArticleViewer } from '@/components/news/ArticleViewer';
import { useLocalSearchParams } from 'expo-router';

export default function ArticleScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  
  if (!url) return null;
  
  return <ArticleViewer url={url} />;
} 