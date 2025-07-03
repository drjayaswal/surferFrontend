import { ConnectionState } from "@/types/app.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const connectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connections: [],
      setConnections: (connections) => set({ connections }),

      hasFetchedConnections: false,
      setHasFetchedConnections: (state) =>
        set({ hasFetchedConnections: state }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "surfer-connections",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        connections: state.connections,
        hasFetchedConnections: state.hasFetchedConnections,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
