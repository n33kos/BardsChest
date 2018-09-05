import lerp from '../../../../utils/lerp';

export default class {
  constructor({
    beats = 1, // how many beats before repeating
    masterAudioNode,
    noteDuration = 100,
    position = 0, // position around the circle in radians
    radius,
    startDelay = 0, // how many beats to delay start
  }) {
    this.masterAudioNode = masterAudioNode;
    this.note = null;
    this.noteDuration = noteDuration;
    this.startDelay = startDelay;
    this.beats = beats;
    this.beatCounter = beats - startDelay; // delay start by subtracting
    this.nextNote = null;
    this.startTime = null;
    this.position = position;
    this.radius = radius / 2;
  }

  fire() {
    if (this.note === null) return;

    // clone note object so we can stop it even it it gets unset before the stop call
    const noteToPlay = Object.assign({}, this.note);
    this.playNote(noteToPlay);

    setTimeout(() => { this.stopNote(noteToPlay); }, this.noteDuration);
  }

  playNote(note) {
    note.audioNode.connect(this.masterAudioNode);
  }

  stopNote(note) {
    note.audioNode.disconnect(this.masterAudioNode);
  }

  getPointAtRadius(cx, cy, radius) {
    return {
      x : cx + radius * Math.cos(this.position),
      y : cy + radius * Math.sin(this.position),
    };
  }

  render(cx, cy, ctx) {
    if (this.nextNote) {
      const duration = (this.endTime - this.startTime);
      const timeElapsedPercentage = (this.endTime - Date.now()) / duration;

      const start = this.getPointAtRadius(cx, cy, this.radius);
      const finish = this.getPointAtRadius(cx, cy, ctx.canvas.height);

      const xpos = lerp(start.x, finish.x, timeElapsedPercentage);
      const ypos = lerp(start.y, finish.y, timeElapsedPercentage);

      ctx.beginPath();
      ctx.fillStyle = this.nextNote.color;
      ctx.arc(xpos, ypos, 10, 0, Math.PI*2);
      ctx.fill();
    }
  }
}
