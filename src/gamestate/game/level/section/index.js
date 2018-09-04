import Note        from '../note/index';
import NoteTrigger from '../noteTrigger/index';

export default class {
  constructor({
    audioContext,
    beats = 4,
    buffer = null,
    isLoaded = false,
    masterAudioNode,
    notes = [
      new Note({ audioContext, color: 'red', frequency: 88 }),
      new Note({ audioContext, color: 'orange', frequency: 98.776 }),
      new Note({ audioContext, color: 'yellow', frequency: 104.65 }),
      new Note({ audioContext, color: 'green', frequency: 117.466 }),
      new Note({ audioContext, color: 'blue', frequency: 131.85 }),
      new Note({ audioContext, color: 'indigo', frequency: 139.692 }),
    ],
    noteTriggers = [
      new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : -Math.PI / 4, beats : 4 }),
      new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 1, position : Math.PI / 4, beats : 4 }),
    ],
    unlockPattern = [0, 1, 2, 3, 4, 5],
    url = 'metronome-100-bpm.ogg',
  }) {
    this.audioContext = audioContext;
    this.beatCounter = beats; // using beats means it will play right away
    this.beats = beats;
    this.buffer = buffer;
    this.isLoaded = isLoaded;
    this.masterAudioNode = masterAudioNode;
    this.notes = notes;
    this.noteTriggers = noteTriggers;
    this.unlockPattern = unlockPattern;
    this.url = url;
  }
}
