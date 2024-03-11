import useStore from "../api/useStore";

export default function useLoginData() {
  const state = useStore();

  if (state.error) {
    throw state.error;
  }

  if (state.status === null) {
    throw state.getStatus();
  }

  const data = {
    message: state.message,
    status: state.status,
    isLoading: state.isLoading,
    isLoginOut: state.isLoginOut,
    error: state.error,
  }

  return data;
}