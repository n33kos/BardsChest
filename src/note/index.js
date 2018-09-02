export default class {
  constructor({
    audioContext,
    color = 'rgba(255, 255, 255, 1)',
    frequency = 110,
  }) {
    this.audioContext = audioContext;
    this.color = color;
    this.frequency = frequency;
    this.audioNode = this.initAudioNode(audioContext);
  }

  initAudioNode(audioContext) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(this.frequency, audioContext.currentTime);
    oscillator.start();
    return oscillator;
  }
}
