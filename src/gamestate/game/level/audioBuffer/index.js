export default class {
  constructor({
    audioFileUrl,
    audioContext,
    masterAudioNode,
    shouldLoop = false,
  }) {
    this.audioContext = audioContext;
    this.audioFileUrl = `${window.location.href}audio/${audioFileUrl}`;
    this.audioNode = null;
    this.buffer = null;
    this.masterAudioNode = masterAudioNode;
    this.shouldLoop = shouldLoop;
  }

  load(resolve, reject) {
    const req = new XMLHttpRequest();
    req.responseType = "arraybuffer";
    req.onload = () => {
      this.createBufferFromData(req.response, resolve);
    }
    req.onerror = () => {
      console.log('Failed to load audio file');
      reject();
    }
    req.open('GET', this.audioFileUrl, true);
    req.send();
  }

  createBufferFromData(data, resolve) {
    this.audioContext.decodeAudioData(data, (buffer) => {
      this.buffer = buffer;
      resolve();
    });
  }

  play(stopTime) {
    this.audioNode = this.audioContext.createBufferSource();
    this.audioNode.buffer = this.buffer;
    this.audioNode.playbackRate.value = 1;
    this.audioNode.loop = this.shouldLoop;
    this.audioNode.connect(this.masterAudioNode);
    this.audioNode.start(0);
    if (stopTime) this.audioNode.stop(stopTime);
  }

  stop() {
    this.audioNode.stop();
  }
}
