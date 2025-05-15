import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: {
    id: '1',
    name: 'Andrei',
    email: 'vip@example.com',
    accessLevel: 'vip'
  },
  login: async () => {
    // Simulate login
    set({
      user: {
        id: '1',
        name: 'VIP User',
        email: 'vip@example.com',
        accessLevel: 'vip'
      }
    });
  },
  logout: () => {
    set({ user: null });
  },
  switchDemoUser: () => {
    // Simulate switching between demo users
    set((state) => ({
      user: state.user?.accessLevel === 'vip' 
        ? { id: '2', name: 'Regular User', email: 'regular@example.com', accessLevel: 'regular' }
        : { id: '1', name: 'VIP User', email: 'vip@example.com', accessLevel: 'vip' }
    }));
  }
}));

export default useAuthStore; 