const ffmpeg = require('fluent-ffmpeg');
const { Transform } = require('stream');
const { EventEmitter } = require('events');
const { SpeechClient } = require('@google-cloud/speech');

class Transcription {
  constructor() {
    this.client = new SpeechClient();
    this.request = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'pl-PL',
        timeout: 60000,
      },
      interimResults: true,
    };
    this.ffmpegProcessTranscription = null;
    this.transcription = 'none';
    this.events = new EventEmitter();
    this.queue = [];
    this.isEmitting = false;
  }

  emitTranscription(data) {
    // const maxDisplayingWords = 20;

    const transcription = data.results.map((result) => result.alternatives[0].transcript).join('\n');

    this.transcription = transcription;
    this.queue.push(this.transcription);

    if (!this.isEmitting) {
      this.emitNextTranscription();
    }
  }

  emitNextTranscription() {
    const delayCaption = 100;

    if (this.queue.length === 0) {
      this.isEmitting = false;
      return;
    }

    this.isEmitting = true;
    let transcription = this.queue.shift();

    this.events.emit('transcriptionChanged', transcription);

    setTimeout(() => this.emitNextTranscription(), delayCaption);
  }

  captureAndTranscribeAudio(streamUrl) {
    let transcribeStream;
    let streamDuration = 0;

    if (!streamUrl) {
      console.log('No stream url provided');
      return;
    }

    const startTranscribeStream = () => {
      transcribeStream = this.client
        .streamingRecognize(this.request)
        .on('error', (error) => {
          if (error.details && error.details.code === -84164) {
            console.log('Internal server error, retrying transcription...');
            startTranscribeStream();
          } else {
            console.error('Error during transcription:', error);
          }
        })
        .on('data', (data) => this.emitTranscription(data));
    };

    startTranscribeStream();

    this.ffmpegProcessTranscription = ffmpeg(streamUrl)
      .outputFormat('wav')
      .audioChannels(1)
      .audioFrequency(44100)
      .output(
        new Transform({
          transform(chunk, encoding, callback) {
            const chunkDuration = chunk.length / 44100; // Calculate the duration of the chunk in seconds
            streamDuration += chunkDuration;

            if (streamDuration > 300) {
              // If the stream duration exceeds 300 seconds
              transcribeStream.end(); // End the current stream
              startTranscribeStream(); // Start a new stream
              streamDuration = chunkDuration; // Reset the stream duration
            }

            if (!transcribeStream.destroyed) {
              transcribeStream.write(chunk);
            }

            callback();
          },
          flush(callback) {
            console.log('Ending transcribeStream');
            transcribeStream.end();
            callback();
          },
        })
      )
      .on('start', () => console.log('Transcription stream started'))
      .on('end', () => console.log('Transcription ffmpeg process ended'))
      .on('error', (error) => console.error('Error during transcription ffmpeg process:', error))
      .run();
  }

  destroy() {
    if (this.ffmpegProcessTranscription) {
      console.log('Destroyed transcription process');
      this.ffmpegProcessTranscription.kill();
      this.ffmpegProcessTranscription = null;
    }
  }
}

module.exports = Transcription;
