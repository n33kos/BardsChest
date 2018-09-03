export default class {
  constructor({
    beats = 4,
    buffer = null,
    isLoaded = false,
    unlockPattern = [0, 1, 2, 3, 4, 5],
    url = 'metronome-100-bpm.ogg',
  }) {
    this.beats = beats;
    this.buffer = buffer;
    this.isLoaded = isLoaded;
    this.unlockPattern = unlockPattern;
    this.url = url;
    this.beatCounter = 4; // 4 means it will play right away
  }
}
