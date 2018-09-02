export default class {
  constructor({
    color = 'white',
    masterAudioNode,
    noteDuration = 100,
    position = 0, // position around the circle in radians
    startDelay = 0,
    triggerInterval = 250, // milliseconds
  }) {
    this.color = color;
    this.masterAudioNode = masterAudioNode;
    this.note = null;
    this.noteDuration = noteDuration;
    this.position = position;
    this.startDelay = startDelay;
    this.triggerInterval = triggerInterval;
  }

  start() {
    // Play once
    this.noteOnOff();

    // Set replay interval
    setInterval(() => { this.noteOnOff() }, this.triggerInterval);
  }

  noteOnOff() {
    if (this.note === null) return;

    // clone note object so we can stop it even it it gets unset before the stop call
    const noteToPlay = Object.assign({}, this.note);
    this.playNote(noteToPlay);

    setTimeout(() => { this.stopNote(noteToPlay); }, this.noteDuration);
  }

  playNote(note) {
    this.color = 'red';
    note.audioNode.connect(this.masterAudioNode);
  }

  stopNote(note) {
    this.color = 'white';
    note.audioNode.disconnect(this.masterAudioNode);
  }
}
