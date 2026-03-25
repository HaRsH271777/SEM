import { create } from 'zustand';

interface UIState {
  isIntroComplete: boolean;
  setIntroComplete: (val: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isIntroComplete: false,
  setIntroComplete: (val) => set({ isIntroComplete: val }),
}));
