import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("vidichat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("vidichat-theme", theme);
    set({ theme });
  },
}));
