export default class {
  constructor({
    audioContext,
    color = 'rgba(255, 255, 255, 1)',
    frequency = 110,
    radius,
  }) {
    this.audioContext = audioContext;
    this.color = color;
    this.frequency = frequency;
    this.audioNode = this.initAudioNode(audioContext);
    this.radius = radius / 2;
  }

  initAudioNode(audioContext) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(this.frequency, audioContext.currentTime);
    oscillator.start();

    const gain = audioContext.createGain();
    gain.gain.value = 0.5;

    return oscillator.connect(gain);
  }

  render(cx, cy, ctx, i, sectionSubtention, rotation) {
    let start = sectionSubtention * i;
    let end = start + sectionSubtention;

    ctx.beginPath();
    ctx.arc(cx, cy, this.radius, (start - rotation), (end - rotation));
    ctx.lineWidth = 10;
    ctx.strokeStyle = this.color;

    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}
