import { UserState } from "@/types/app.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
      name: "surfer",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        authChecked: state.authChecked,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
