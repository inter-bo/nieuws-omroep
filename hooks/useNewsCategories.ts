import { useState, useEffect } from 'react';
import { NewsCategory } from '@/types/news';

const DEFAULT_CATEGORIES: NewsCategory[] = [
  {
    id: 'all',
    name: 'All News',
    feeds: [],
  },
  {
    id: 'politics',
    name: 'Politics',
    feeds: [],
  },
  {
    id: 'sports',
    name: 'Sports',
    feeds: [],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    feeds: [],
  },
];

export function useNewsCategories() {
  const [categories, setCategories] = useState<NewsCategory[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Fetch categories from API or storage
  }, []);

  return {
    categories,
    isLoading,
    error,
  };
} 