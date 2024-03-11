export const createStreamSlice = (set, get) => ({
  streaming: null,
  recording: null,
  isStreamLoading: false,
  errorStream: null,
  errorRecorder: null,
  startStream: async () => {
    set({ isStreamLoading: true })
    try {
      const response = await fetch('http://localhost:9000/start-stream');
      await response.json();
      get().loadStream();
    } catch (error) {
      set({ errorStream: error, isStreamLoading: false });
    }
  },
  loadStream: async () => {
    let continuePolling = true;
    while (continuePolling) {
      try {
        const response = await fetch('http://localhost:9000/stream-status');
        const data = await response.json();

        if (data.found) {
          continuePolling = false
          set({ streaming: data.found, isStreamLoading: false, errorStream: null });
        } else {
          set({ streaming: data.found, isStreamLoading: true, errorStream: null });
        }
      } catch (error) {
        continuePolling = false
        set({ errorStream: error, isStreamLoading: false });
      }
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
  },
  startRecording: async () => {
    try {
      const response = await fetch('http://localhost:9000/start-recording');
      await response.json();
      set({ recording: true, errorRecorder: null });
    } catch (error) {
      set({ errorRecorder: error });
    }
  },
  getStreamStatus: async () => {
    try {
      const response = await fetch('http://localhost:9000/stream-status');
      const data = await response.json();

      set({ streaming: data.found, errorStream: null });
    } catch (error) {
      set({ streaming: null, errorStream: error });
    }
  }
})