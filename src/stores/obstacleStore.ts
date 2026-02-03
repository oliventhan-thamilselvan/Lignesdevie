import { create } from 'zustand';

interface ObstacleState {
  isBlocked: boolean;
  maxScrollPosition: number;
  setBlocked: (blocked: boolean) => void;
  updateMaxScroll: (position: number) => void;
  reset: () => void;
}

/**
 * Store Zustand pour gérer le blocage des obstacles
 * Permet de bloquer réellement le scroll horizontal
 */
export const useObstacleStore = create<ObstacleState>((set) => ({
  isBlocked: false,
  maxScrollPosition: Infinity,
  
  setBlocked: (blocked: boolean) =>
    set({ isBlocked: blocked }),
  
  updateMaxScroll: (position: number) =>
    set((state) => ({
      maxScrollPosition: Math.max(state.maxScrollPosition, position)
    })),
  
  reset: () =>
    set({ isBlocked: false, maxScrollPosition: Infinity }),
}));
