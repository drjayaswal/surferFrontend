import { useEffect } from "react";
import { userStore } from "@/stores/userStore";
import { connectionStore } from "@/stores/connectionStore";
import { apiClient } from "@/lib/api";
import { Connection } from "@/types/app.types";

export const useHydration = () => {
  // User store
  const setUser = userStore((s) => s.setUser);
  const user = userStore((s) => s.user);
  const setLoading = userStore((s) => s.setLoading);
  const setAuthChecked = userStore((s) => s.setAuthChecked);
  const userHasHydrated = userStore((s) => s._hasHydrated);

  // Connection store
  const connections = connectionStore((s) => s.connections);
  const setConnections = connectionStore((s) => s.setConnections);
  const setHasFetchedConnections = connectionStore(
    (s) => s.setHasFetchedConnections
  );
  const connectionsHasHydrated = connectionStore((s) => s._hasHydrated);

  useEffect(() => {
    // Wait for Zustand hydration to complete
    if (!userHasHydrated || !connectionsHasHydrated) {
      console.log("[Hydration] Waiting for Zustand hydration...");
      return;
    }

    const hydrate = async () => {
      console.log(
        "[Hydration] Zustand stores are hydrated, checking user and connections..."
      );

      // Hydrate user if not present
      if (!user) {
        setLoading(true);
        try {
          console.log("[Hydration] Fetching user from backend...");
          const response = await apiClient.getUserData();

          if (response.success && response.data) {
            setUser(response.data);
            console.log("[Hydration] User fetched and stored");
          } else {
            setUser(null);
            console.warn("[Hydration] No user found in response");
          }
        } catch (error) {
          console.error("[Hydration] Failed to fetch user:", error);
          setUser(null);
        } finally {
          setLoading(false);
          setAuthChecked(true);
        }
      } else {
        console.log("[Hydration] User already present in store");
        setAuthChecked(true);
      }

      // Hydrate connections if not present
      const localConnections = localStorage.getItem("surfer-connections");

      if (!localConnections || connections.length === 0) {
        try {
          console.log("[Hydration] Fetching connections from backend...");
          const connResponse = await apiClient.getConnections();

          if (connResponse.success && Array.isArray(connResponse.data)) {
            const connections: Connection[] = connResponse.data;
            setConnections(connections);
            setHasFetchedConnections(true);
            console.log(
              `[Hydration] ${connections.length} connections fetched and stored`
            );
          } else {
            console.warn("[Hydration] No connections found in response.");
          }
        } catch (error) {
          console.error("[Hydration] Failed to fetch connections:", error);
        }
      } else {
        console.log(
          "[Hydration] Connections already present in store"
        );
      }
    };

    hydrate();
  }, [userHasHydrated, connectionsHasHydrated]);
};
