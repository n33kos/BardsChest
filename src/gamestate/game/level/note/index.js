export default class {
  constructor({
    audioContext,
    color = 'rgba(255, 255, 255, 1)',
    frequency = 110,
    radius,
    url,
    masterAudioNode,
  }) {
    this.audioContext = audioContext;
    this.color = color;
    this.audioNode = null;
    this.radius = radius / 2;
    this.url = url,
    this.masterAudioNode = masterAudioNode;
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
