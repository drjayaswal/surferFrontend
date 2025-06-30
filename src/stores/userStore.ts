import { CorpusFile, Note } from "@/types/app.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatar_uploaded_at: string;
  bio: string;
  refresh_token?: string;
  corpuses: CorpusFile[];
  notes: Note[];
  created_at?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;

  authChecked: boolean;
  setAuthChecked: (checked: boolean) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const userStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      authChecked: false,
      setAuthChecked: (checked) => set({ authChecked: checked }),

      loading: true,
      setLoading: (loading) => set({ loading }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "surfer", // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        console.log("✅ Zustand has hydrated");
      },
    }
  )
);