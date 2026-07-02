import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface UIState {
  isCreateDialogOpen: boolean;
  isSidebarCollapsed: boolean;
  activeCategory: string;
}

export interface UIActions {
  setCreateDialogOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveCategory: (category: string) => void;
  resetUI: () => void;
}

export type UIStore = UIState & UIActions;

const initialUIState: UIState = {
  isCreateDialogOpen: false,
  isSidebarCollapsed: false,
  activeCategory: 'all',
};

export const useUIStore = create<UIStore>()(
  subscribeWithSelector((set) => ({
    ...initialUIState,

    setCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
    toggleSidebar: () =>
      set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setActiveCategory: (category) => set({ activeCategory: category }),
    resetUI: () => set(initialUIState),
  })),
);
