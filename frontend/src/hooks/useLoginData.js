import useStore from "../api/useStore";

export default function useLoginData() {
  const state = useStore();

  if (state.error) {
    throw state.error;
  }

  if (state.status === null) {
    throw state.getStatus();
  }

  return state;
}