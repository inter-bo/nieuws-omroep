import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Colors } from '@/constants/Colors';

export function useTheme() {
  const darkMode = useSelector((state: RootState) => state.settings.darkMode);
  return darkMode ? Colors.dark : Colors.light;
}
