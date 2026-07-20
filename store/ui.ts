import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface UIState {
  isCreateDialogOpen: boolean;
  isSidebarCollapsed: boolean;
  activeCategory: string;
  isAIChatOpen: boolean;
  aiInitialPrompt: string;
}

export interface UIActions {
  setCreateDialogOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveCategory: (category: string) => void;
  openAIChat: (prompt?: string) => void;
  closeAIChat: () => void;
  resetUI: () => void;
}

export type UIStore = UIState & UIActions;

const initialUIState: UIState = {
  isCreateDialogOpen: false,
  isSidebarCollapsed: false,
  activeCategory: 'all',
  isAIChatOpen: false,
  aiInitialPrompt: '',
};

export const useUIStore = create<UIStore>()(
  subscribeWithSelector((set) => ({
    ...initialUIState,

    setCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
    toggleSidebar: () =>
      set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setActiveCategory: (category) => set({ activeCategory: category }),
    openAIChat: (prompt = '') =>
      set({ isAIChatOpen: true, aiInitialPrompt: prompt }),
    closeAIChat: () => set({ isAIChatOpen: false, aiInitialPrompt: '' }),
    resetUI: () => set(initialUIState),
  })),
);
