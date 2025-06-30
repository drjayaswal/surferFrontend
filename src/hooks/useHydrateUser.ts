import { useEffect } from "react";
import { userStore } from "@/stores/userStore";
import { apiClient } from "@/lib/api";

/**
 * Hydrates the Zustand user store by:
 * 1. Waiting for rehydration from localStorage.
 * 2. Fetching user data from API only if not already present.
 * 3. Setting authChecked and loading flags properly.
 */
export const useHydrateUser = () => {
  const setUser = userStore((s) => s.setUser);
  const user = userStore((s) => s.user);
  const hasHydrated = userStore((s) => s._hasHydrated);
  const setLoading = userStore((s) => s.setLoading);
  const setAuthChecked = userStore((s) => s.setAuthChecked);

  useEffect(() => {
    console.log("hydrated:", hasHydrated); // 🧪 debug
    console.log("userStore.user:", user); // 🧪 debug
    if (!hasHydrated) return;

    const fetchUser = async () => {
      if (user) {
        console.log("User already exists in store");
        setLoading(false);
        setAuthChecked(true);
        return;
      }

      setLoading(true);
      try {
        const response = await apiClient.getUserData();
        if (response.success && response.data) {
          console.log("✅ fetched from API:", response.data);
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchUser();
  }, [hasHydrated, user]);
};
