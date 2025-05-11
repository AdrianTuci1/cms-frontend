import { create } from 'zustand';

const useDrawerStore = create((set) => ({
  isOpen: false,
  content: null,
  title: '',
  
  openDrawer: (content, title) => set({
    isOpen: true,
    content,
    title
  }),
  
  closeDrawer: () => set({
    isOpen: false,
    content: null,
    title: ''
  })
}));

export default useDrawerStore; 