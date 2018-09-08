import areArraysIdentical    from '../../../../utils/areArraysIdentical';
import lerp                  from '../../../../utils/lerp';
import oneBeatInMilliseconds from '../../../../utils/oneBeatInMilliseconds';

export default class {
  constructor({
    beats = 1, // how many beats before repeating
    masterAudioNode,
    position = 0, // position around the circle in radians
    radius,
    startDelay = 0, // how many beats to delay start
  }) {
    this.beatCounter = beats - startDelay; // delay start by subtracting
    this.beats = beats;
    this.currentNote = null;
    this.masterAudioNode = masterAudioNode;
    this.position = position;
    this.radius = radius / 2;
    this.startDelay = startDelay;
    this.startTime = null;
    this.targetNote = null;
  }

  triggerNote() {
    if (this.currentNote === null) return;
    this.currentNote.audioNode.play();
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

  render(cx, cy, ctx) {
    if (this.targetNote) {
      const duration = (this.endTime - this.startTime);
      const timeElapsedPercentage = (this.endTime - Date.now()) / duration;

      const start = this.getPointAtRadius(cx, cy, this.radius);
      const finish = this.getPointAtRadius(cx, cy, ctx.canvas.height);

      const xpos = lerp(start.x, finish.x, timeElapsedPercentage);
      const ypos = lerp(start.y, finish.y, timeElapsedPercentage);

      ctx.beginPath();
      ctx.fillStyle = this.targetNote.color;
      ctx.arc(xpos, ypos, 10, 0, Math.PI*2);
      ctx.fill();
    }
  }

  audioRender(section, sectionProgress, sectionKey, rotation) {
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
      }

      // Set trigger's nextnote
      this.targetNote = section.notes[section.unlockPattern[sectionProgress]];

      // play the note if it exists
      if (this.currentNote && this.targetNote) {
        this.triggerNote();

        // Increment section progress
        sectionProgress++;
        if (sectionProgress >= section.unlockPattern.length) sectionProgress = 0;
      }

      this.setStartEndTimes(section.bpm);

      // Return score
      if (this.currentNote !== this.targetNote) score = -5;
      score = 10;
    }

    return {score, sectionProgress};
  }
}
