export default class {
  constructor({
    audioFileUrl,
    audioContext,
    masterAudioNode,
  }) {
    this.audioContext = audioContext;
    this.audioFileUrl = `${window.location.href}audio/${audioFileUrl}`;
    this.audioNode = null;
    this.buffer = null;
    this.masterAudioNode = masterAudioNode;
  }

  load(callback) {
    const req = new XMLHttpRequest();
    req.responseType = "arraybuffer";
    req.onload = () => {
      this.createBufferFromData(req.response);
      callback();
    }
    req.onerror = () => {
      callback();
    }
    req.open('GET', this.audioFileUrl, true);
    req.send();
  }

  createBufferFromData(data) {
    this.audioContext.decodeAudioData(data, (buffer) => {
      this.buffer = buffer;
    });
  }

  play() {
    this.audioNode = this.audioContext.createBufferSource();
    this.audioNode.buffer = this.buffer;
    this.audioNode.connect(this.masterAudioNode);
    this.audioNode.start();
  }
}
