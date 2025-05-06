import { create } from 'zustand';
import assistantsData from '../data/assistants.json';

export const useAssistantStore = create((set) => ({
  assistants: assistantsData,

  toggleAssistant: (assistantId) => 
    set((state) => ({
      assistants: {
        ...state.assistants,
        [assistantId]: {
          ...state.assistants[assistantId],
          isActive: !state.assistants[assistantId].isActive
        }
      }
    })),

  updateAssistantConfig: (assistantId, config) =>
    set((state) => ({
      assistants: {
        ...state.assistants,
        [assistantId]: {
          ...state.assistants[assistantId],
          config: {
            ...state.assistants[assistantId].config,
            ...config
          }
        }
      }
    }))
})); 