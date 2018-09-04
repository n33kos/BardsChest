import AudioBuffer from './audioBuffer/index';
import Note        from './note/index';
import NoteTrigger from './noteTrigger/index';
import Section     from './section/index';

export default class {
  constructor({
    audioContext,
    bpm = 100,
    sections,
    GameState,
    masterAudioNode,
  }) {
    this.audioContext = audioContext;
    this.sections = sections;
    this.bpm = bpm;
    this.GameState = GameState;
    this.masterAudioNode = masterAudioNode;
    this.sections = [
      new Section({
        audioContext,
        masterAudioNode,
        unlockPattern : [0, 1, 2, 3, 4, 5],
        notes : [
          new Note({ audioContext, color: 'red', frequency: 88 }),
          new Note({ audioContext, color: 'orange', frequency: 98.776 }),
          new Note({ audioContext, color: 'yellow', frequency: 104.65 }),
          new Note({ audioContext, color: 'green', frequency: 117.466 }),
          new Note({ audioContext, color: 'blue', frequency: 131.85 }),
          new Note({ audioContext, color: 'indigo', frequency: 139.692 }),
        ]
      }),
      new Section({
        audioContext,
        masterAudioNode,
        unlockPattern : [0, 1, 0, 2, 0, 3],
        noteTriggers : [
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : 0, beats : 4 }),
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 1, position : Math.PI, beats : 4 }),
        ],
        notes : [
          new Note({ audioContext, color: 'red', frequency: 88 }),
          new Note({ audioContext, color: 'orange', frequency: 98.776 }),
          new Note({ audioContext, color: 'green', frequency: 117.466 }),
          new Note({ audioContext, color: 'indigo', frequency: 139.692 }),
        ]
      }),
    ];
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
