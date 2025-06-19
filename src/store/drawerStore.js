import { create } from 'zustand';

const useDrawerStore = create((set) => ({
  isOpen: false,
  content: null,
  title: '',
  type: 'drawer', // 'drawer' or 'ai-assistant'
  
  openDrawer: (content, title, type = 'drawer') => set({
    isOpen: true,
    content,
    title,
    type
  }),
  
  closeDrawer: () => set({
    isOpen: false,
    content: null,
    title: '',
    type: 'drawer'
  })
}));

export default useDrawerStore; 