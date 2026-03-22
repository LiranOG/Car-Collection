import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GarageState } from './types';

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      savedCarIds: [],
      addCar: (id) => set((state) => ({ 
        savedCarIds: state.savedCarIds.includes(id) ? state.savedCarIds : [...state.savedCarIds, id] 
      })),
      removeCar: (id) => set((state) => ({ 
        savedCarIds: state.savedCarIds.filter((carId) => carId !== id) 
      })),
      hasCar: (id) => get().savedCarIds.includes(id),
    }),
    {
      name: 'dream-garage-storage',
    }
  )
);
