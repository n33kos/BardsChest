import Note        from '../note/index';
import NoteTrigger from '../noteTrigger/index';

export default class {
  constructor({
    audioContext,
    beats,
    beatCounter,
    bpm,
    buffer = null,
    masterAudioNode,
    radius,
    notes = [
      new Note({ audioContext, color: 'red', frequency: 88, radius }),
      new Note({ audioContext, color: 'orange', frequency: 98.776, radius }),
      new Note({ audioContext, color: 'yellow', frequency: 104.65, radius }),
      new Note({ audioContext, color: 'green', frequency: 117.466, radius }),
      new Note({ audioContext, color: 'blue', frequency: 131.85, radius }),
      new Note({ audioContext, color: 'indigo', frequency: 139.692, radius }),
    ],
    noteTriggers,
    unlockPattern = [0, 1, 2, 3, 4, 5],
    url = 'metronome-100-bpm.ogg',
  }) {
    this.audioContext = audioContext;
    this.audioNode = null;
    this.beatCounter = beatCounter;
    this.beats = beats;
    this.bpm = bpm;
    this.buffer = buffer;
    this.masterAudioNode = masterAudioNode;
    this.notes = notes;
    this.noteTriggers = noteTriggers;
    this.radius = radius;
    this.unlockPattern = unlockPattern;
    this.url = url;
  }

  load() {
  }
}
