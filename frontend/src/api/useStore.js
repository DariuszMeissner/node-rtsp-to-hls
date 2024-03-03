import { create } from 'zustand';
import { createLoginSlice } from './slices/createLoginSlice';

export const useStore = create((...a) => ({
  ...createLoginSlice(...a),
}))

export default useStore 