import { create } from 'zustand';
import { User } from '@/types/auth';
import { userService } from '@/services/user/user.service';
import { ApiError } from '@/types/api';

interface UserState {
  selectedUser: User | null;
  userCache: Record<string, User>;
  isLoading: boolean;
  error: string | null;

  fetchUserById: (id: string) => Promise<User | null>;
  clearSelectedUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  selectedUser: null,
  userCache: {},
  isLoading: false,
  error: null,

  fetchUserById: async (id: string) => {
    // 1. Check cache first
    const cached = get().userCache[id];
    if (cached) {
      set({ selectedUser: cached, error: null });
      return cached;
    }

    // 2. Fetch from API
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getUserById(id);
      const user = response.data as User;

      set((state) => ({
        selectedUser: user,
        userCache: { ...state.userCache, [id]: user },
        isLoading: false,
        error: null,
      }));

      return user;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to fetch user details',
      });
      return null;
    }
  },

  clearSelectedUser: () => set({ selectedUser: null }),
}));
