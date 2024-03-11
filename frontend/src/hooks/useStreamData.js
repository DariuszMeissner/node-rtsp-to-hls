import useStore from "../api/useStore";

export default function useStreamData() {
  const state = useStore();

  if (state.errorStream) {
    throw state.errorStream;
  }

  if (state.streaming === null) {
    throw state.getStreamStatus();
  }

  const data = {
    streaming: state.streaming,
    recording: state.recording,
    isStreamLoading: state.isStreamLoading,
    errorStream: state.errorStream,
    errorRecorder: state.errorRecorder,
  }

  return data;
}