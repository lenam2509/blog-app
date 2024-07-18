import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  name: string;
};

type UserStore = {
  user: User | null;
  isAuth: boolean;
  setUser: (user: User) => void;
  setAuth: (isAuth: boolean) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      setUser: (user) => set({ user }),
      setAuth: (isAuth) => set({ isAuth }),
      logout: () => set({ user: null, isAuth: false, }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
