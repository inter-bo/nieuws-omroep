import { renderHook, act } from '@testing-library/react-native';
import { DrawerProvider, useDrawer } from '@/context/DrawerContext';

describe('DrawerContext', () => {
  it('returns default values when used without a Provider', () => {
    const { result } = renderHook(() => useDrawer());
    expect(result.current.isOpen).toBe(false);
    expect(typeof result.current.open).toBe('function');
    expect(typeof result.current.close).toBe('function');
  });

  it('initial isOpen is false inside Provider', () => {
    const { result } = renderHook(() => useDrawer(), { wrapper: DrawerProvider });
    expect(result.current.isOpen).toBe(false);
  });

  it('open() sets isOpen to true', () => {
    const { result } = renderHook(() => useDrawer(), { wrapper: DrawerProvider });
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it('close() after open() sets isOpen back to false', () => {
    const { result } = renderHook(() => useDrawer(), { wrapper: DrawerProvider });
    act(() => result.current.open());
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('close() when already closed keeps isOpen false', () => {
    const { result } = renderHook(() => useDrawer(), { wrapper: DrawerProvider });
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });
});
