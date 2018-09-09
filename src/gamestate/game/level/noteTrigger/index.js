import areArraysIdentical    from '../../../../utils/areArraysIdentical';
import lerp                  from '../../../../utils/lerp';
import oneBeatInMilliseconds from '../../../../utils/oneBeatInMilliseconds';

export default class {
  constructor({
    beats = 1, // how many beats before repeating
    bpm,
    masterAudioNode,
    position = 0, // position around the circle in radians
    radius,
    startDelay = 0, // how many beats to delay start
  }) {
    this.beatCounter = beats - startDelay; // delay start by subtracting
    this.beats = beats;
    this.bpm = bpm;
    this.currentNote = null;
    this.masterAudioNode = masterAudioNode;
    this.position = position;
    this.radius = radius / 2;
    this.startDelay = startDelay;
    this.startTime = null;
    this.setStartEndTimes(bpm);
  }

  triggerNote() {
    if (this.currentNote === null) return;
    this.currentNote.audioNode.play();
    this.currentNote.radiusModifier = 5;
  }

  getPointAtRadius(cx, cy, radius) {
    return {
      x : cx + radius * Math.cos(this.position),
      y : cy + radius * Math.sin(this.position),
    };
  }

  loopValue(val, min, max) {
    const p = max - min;
    let mod = (val - min) % p;
    if (mod < 0) mod += p;
    return min + mod;
  }

  getNoteForPosition(section, rotation) {
    const fullCircle = Math.PI * 2;
    const noteSectionLength = fullCircle / section.notes.length;
    let cleanRotation = this.loopValue(rotation + this.position, 0, fullCircle);
    let index = Math.abs(Math.floor(cleanRotation / noteSectionLength));

    return {note: section.notes[index], index};
  }

  setStartEndTimes(bpm) {
    // set start and end times for next beat
    this.startTime = Date.now();
    this.endTime = Date.now() + (oneBeatInMilliseconds(bpm) * this.beats);
  }

  getPositionOnScreenRomAngle(cx, cy, ctx) {
    if (this.position === 0) return [ctx.canvas.width, cy];
    if (this.position === Math.PI) return [0, cy];
    if (this.position === -Math.PI*0.5) return [cx, 0];
    return [0, 0];
  }

  render(cx, cy, ctx) {
    const duration = (this.endTime - this.startTime);
    const timeElapsedPercentage = 1 - (this.endTime - Date.now()) / duration;

    // const start = this.getPointAtRadius(cx, cy, this.radius);
    // const finish = this.getPointAtRadius(cx, cy, ctx.canvas.height);
    //
    // const xpos = lerp(finish.x, start.x, timeElapsedPercentage);
    // const ypos = lerp(finish.y, start.y, timeElapsedPercentage);

    // ctx.beginPath();
    // ctx.fillStyle = 'white';
    // ctx.arc(xpos, ypos, 10, 0, Math.PI*2);
    // ctx.fill();

    const pos = this.getPositionOnScreenRomAngle(cx, cy, ctx);
    const dist = (this.position === 0 || this.position === Math.PI) ? cx : cy;
    ctx.beginPath();
    ctx.shadowColor = 'rgba(255, 244, 216, 1)';
    ctx.shadowBlur = 40;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 244, 216, 1)';
    ctx.arc(...pos, (dist - this.radius) * timeElapsedPercentage, 0, Math.PI*2);
    ctx.stroke();
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = 'rgba(255, 244, 216, 0.3)';
    // ctx.arc(...pos, Math.max(dist - this.radius - 50 * timeElapsedPercentage) * timeElapsedPercentage, 0, Math.PI*2, 0);
    // ctx.stroke();
    // ctx.lineWidth = 5;
    // ctx.strokeStyle = 'rgba(255, 244, 216, 0.1)';
    // ctx.arc(...pos, Math.max(dist - this.radius - 100 * timeElapsedPercentage) * timeElapsedPercentage, 0, Math.PI*2, 0);
    // ctx.stroke();
    // ctx.shadowBlur = 0;
  }

  audioRender(section, sectionProgress, sectionKey, rotation, updateIndicators, triggerCenterGlow) {
    let score = 0;

    this.beatCounter++;
    if(this.beatCounter > this.beats) {
      // Reset beat counter
      this.beatCounter = 1;

      // Get current note
      const tempNote = this.getNoteForPosition(section, rotation);
      this.currentNote = tempNote.note;

      // add to section key
      if (section.unlockPattern[sectionKey.length] === tempNote.index) {
        sectionKey.push(tempNote.index);
        updateIndicators(section.unlockPattern, sectionKey, section.notes);
        triggerCenterGlow(1);
      }

      // play the note if it exists
      if (this.currentNote) {
        this.triggerNote();

        // Increment section progress
        sectionProgress++;
        if (sectionProgress >= section.unlockPattern.length) sectionProgress = 0;
      }

      this.setStartEndTimes(this.bpm);

      score = 10;
    }

    return {score, sectionProgress};
  }
}
