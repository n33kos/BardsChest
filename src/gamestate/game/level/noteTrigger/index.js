export default class {
  constructor({
    masterAudioNode,
    noteDuration = 100,
    position = 0, // position around the circle in radians
    startDelay = 0, // how many beats to delay start
    beats = 1, // how many beats before repeating
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
}
