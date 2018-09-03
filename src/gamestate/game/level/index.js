import AudioBuffer from './audioBuffer/index';
import Note        from './note/index';
import NoteTrigger from './noteTrigger/index';
import Section     from './section/index';

export default class {
  constructor({
    audioContext,
    bpm = 100,
    sections = [
      new Section({ unlockPattern : [0, 1, 2, 3, 4, 5] }),
      new Section({ unlockPattern : [5, 4, 3, 2, 1, 0] }),
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
      new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : -Math.PI / 4, beats : 4 }),
      new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 1, position : Math.PI / 4, beats : 4 }),
    ],
  }) {
    this.audioContext = audioContext;
    this.sections = sections;
    this.bpm = bpm;
    this.GameState = GameState;
    this.masterAudioNode = masterAudioNode;
    this.notes = notes;
    this.noteTriggers = noteTriggers;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.sections.forEach(section => {
        section.buffer = new AudioBuffer({
          audioContext    : this.audioContext,
          audioFileUrl    : section.url,
          masterAudioNode : this.masterAudioNode,
        });

        new Promise(section.buffer.load.bind(section.buffer)).then(() => {
          section.isLoaded = true;
          resolve();
        });
      });

      // Here we will load the level's note samples as well!

      resolve();
    });
  }
}
