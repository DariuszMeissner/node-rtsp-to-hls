import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createLoginSlice } from './slices/createLoginSlice';
import { createStreamSlice } from './slices/createStreamSlice';

export const useStore = create(devtools((...a) => ({
  ...createLoginSlice(...a),
  ...createStreamSlice(...a),
}), 'MyStore'));

export default useStore 