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
    this.duration = 0;
    this.masterAudioNode = masterAudioNode;
    this.position = position;
    this.radius = radius / 2;
    this.startDelay = startDelay;
    this.startTime = null;
    this.setStartEndTimes(bpm, startDelay);
  }

  triggerNote() {
    if (this.currentNote === null) return;
    this.currentNote.audioNode.play();
    this.currentNote.radiusModifier = 5;
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
    this.startTime = Date.now();
    this.endTime = this.startTime + (oneBeatInMilliseconds(bpm) * this.beats);
    this.duration = this.endTime - this.startTime;
  }

  recalculateEndTime() {
    //Recalculate End Time, this helps keep the animation on time when a section loads
    this.endTime = Date.now() + (oneBeatInMilliseconds(this.bpm) * (this.beats - this.beatCounter + 1));
  }

  getPositionOnScreenFromAngle(cx, cy, ctx) {
    if (this.position === 0) return [ctx.canvas.width, cy];
    if (this.position === Math.PI) return [0, cy];
    if (this.position === -Math.PI*0.5) return [cx, 0];
    return [0, 0];
  }

  load() {
    this.recalculateEndTime();
  }

  render(cx, cy, ctx) {
    const timeElapsedPercentage = 1 - (this.endTime - Date.now()) / this.duration;

    const pos = this.getPositionOnScreenFromAngle(cx, cy, ctx);
    const dist = (this.position === 0 || this.position === Math.PI) ? cx : cy;
    ctx.beginPath();
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(255, 244, 216, 1)';
    ctx.strokeStyle = 'rgba(255, 244, 216, 1)';
    ctx.arc(...pos, (dist - this.radius) * timeElapsedPercentage, 0, Math.PI*2);
    ctx.stroke();
    ctx.shadowBlur = 0;
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
        triggerCenterGlow(1);
        score = 10 * section.multiplier;
        section.multiplier += 1;
      }else{
        score -= 10;
        section.multiplier = 1;
        sectionKey.pop();
      }
      updateIndicators(section.unlockPattern, sectionKey, section.notes);

      // play the note if it exists
      if (this.currentNote) {
        this.triggerNote();

        // Increment section progress
        sectionProgress++;
        if (sectionProgress >= section.unlockPattern.length) sectionProgress = 0;
      }

      this.setStartEndTimes(this.bpm);
    }

    return {score, sectionProgress};
  }
}
