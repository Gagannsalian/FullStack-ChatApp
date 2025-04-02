import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light", // ✅ Load from storage
  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme); // ✅ Persist theme
    set({ theme: newTheme });
  },
}));
