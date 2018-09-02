import Note        from '../note/index';
import NoteTrigger from '../noteTrigger/index';
import AudioBuffer from '../audioBuffer/index';

export default class {
  constructor({
    audioContext,
    bpm = 100,
    backgroundTrack = [
      { beats : 4, url : '' },
    ],
    GameState,
    masterAudioNode,
    notes = [
      new Note({ audioContext, bpm, color: 'red', frequency: 88 }),
      new Note({ audioContext, bpm, color: 'orange', frequency: 98.776 }),
      new Note({ audioContext, bpm, color: 'yellow', frequency: 104.65 }),
      new Note({ audioContext, bpm, color: 'green', frequency: 117.466 }),
      new Note({ audioContext, bpm, color: 'blue', frequency: 131.85 }),
      new Note({ audioContext, bpm, color: 'indigo', frequency: 139.692 }),
    ],
    noteTriggers = [
      new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : 0, triggerInterval : 600 }),
      new NoteTrigger({ masterAudioNode, noteDuration : 200, startDelay: 300, position : (-Math.PI / 2), triggerInterval : 600 }),
      new NoteTrigger({ masterAudioNode, noteDuration : 200, startDelay: 900, position : (Math.PI / 2), triggerInterval : 600 }),
    ],
  }) {
    this.audioContext = audioContext;
    this.backgroundTrack = backgroundTrack;
    this.bpm = bpm;
    this.GameState = GameState;
    this.masterAudioNode = masterAudioNode;
    this.notes = notes;
    this.noteTriggers = noteTriggers;
    this.progress = 0;
  }

  start() {
    this.playBackgroundTrack();
  }

  playBackgroundTrack() {
    let bgTrack = new AudioBuffer({
      audioContext    : this.audioContext,
      audioFileUrl    : this.backgroundTrack[this.progress].url,
      masterAudioNode : this.masterAudioNode,
    });

    // LEVEL LOADING CHAIN HAPPENS HERE
    new Promise(bgTrack.load.bind(bgTrack)).then(() => {
      new Promise(this.setNotesForTriggers.bind(this, 0)).then(() => {
        this.initTriggers();

        // We loop this way because it ensures each loop of the BG track is
        // synced with the notes. that way we dont rely on precision in
        // the track length to make sure the song stays synced up
        const frequency = this.getBackgroundRepeatFrequency();
        bgTrack.play(frequency);
        setInterval(bgTrack.play.bind(bgTrack, frequency), frequency);
      });
    });
  }

  initTriggers() {
    this.noteTriggers.forEach(trigger => {
      setTimeout(() => { trigger.start(); }, trigger.startDelay);
    });
  }

  setNotesForTriggers(rotation, resolve, reject) {
    this.noteTriggers.forEach(trigger => {
      trigger.note = this.getNoteForPosition(trigger.position, rotation);
    });
    if (resolve !== undefined) resolve();
  }

  getNoteForPosition(position, rotation) {
    const noteSectionLength = (Math.PI * 2 / this.notes.length);
    let index = Math.floor((position + rotation) / noteSectionLength);

    // I think there is a smarter way to do this without a damned while loop
    while (index < 0) { index = this.notes.length + index; }
    if (index > this.notes.length) index = Math.floor(index % this.notes.length);

    return this.notes[Math.abs(index)];
  }

  getBackgroundRepeatFrequency() {
    return this.oneBeatInMilliseconds() * this.backgroundTrack[this.progress].beats;
  }

  oneBeatInMilliseconds() {
    return 60000 / this.bpm;
  }
}
