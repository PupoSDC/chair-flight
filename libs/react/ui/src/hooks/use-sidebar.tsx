import { create } from "zustand";

export const useSidebarStore = create<{
  isMobileOpen: boolean;
  isDesktopOpen: boolean;
  setMobileOpen: (isMobileOpen: boolean) => void;
  setDesktopOpen: (isDesktopOpen: boolean) => void;
}>((set) => ({
  isMobileOpen: false,
  isDesktopOpen: true,
  setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
  setDesktopOpen: (isDesktopOpen) => set({ isDesktopOpen }),
}))

export const useSidebar = () => {
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const openSidebar = () => setMobileOpen(true);
  return { openSidebar };
};