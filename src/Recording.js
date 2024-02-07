
export default class Recording {
  isRecording = false;
  recorderProcess = null;

  constructor() { }

  setIsRecording(status) {
    this.setIsRecording = status;
  }

  setRecorderProcess(process) {
    this.recorderProcess = process;
  }

  getRecorderProcess() {
    return this.recorderProcess;
  }

  getIsRecording() {
    return this.setIsRecording;
  }
}