import Note        from '../note/index';
import NoteTrigger from '../noteTrigger/index';

export default class {
  constructor({
    audioContext,
    bpm = 120,
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
      new NoteTrigger({ masterAudioNode, noteDuration : 200, startDelay: 0, position : 0, triggerInterval : 750 }),
      new NoteTrigger({ masterAudioNode, noteDuration : 200, startDelay: 0, position : (-Math.PI / 2), triggerInterval : 500 }),
      new NoteTrigger({ masterAudioNode, noteDuration : 200, startDelay: 0, position : (Math.PI / 2), triggerInterval : 1000 }),
    ],
  }) {
    this.audioContext = audioContext;
    this.bpm = bpm;
    this.GameState = GameState;
    this.masterAudioNode = masterAudioNode;
    this.notes = notes;
    this.noteTriggers = noteTriggers;
  }
}
