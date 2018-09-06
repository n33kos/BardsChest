import AudioBuffer from './audioBuffer/index';
import Note        from './note/index';
import NoteTrigger from './noteTrigger/index';
import Section     from './section/index';

export default class {
  constructor({
    audioContext,
    bpm = 100,
    GameState,
    masterAudioNode,
    radius,
    sections,
  }) {
    this.audioContext = audioContext;
    this.sections = sections;
    this.bpm = bpm;
    this.GameState = GameState;
    this.masterAudioNode = masterAudioNode;
    this.radius = radius;
    this.sections = [
      new Section({
        audioContext,
        bpm,
        masterAudioNode,
        unlockPattern : [0, 1, 2, 3, 4, 5],
        notes : [
          new Note({ audioContext, color: 'red', frequency: 88, radius }),
          new Note({ audioContext, color: 'orange', frequency: 98.776, radius }),
          new Note({ audioContext, color: 'yellow', frequency: 104.65, radius }),
          new Note({ audioContext, color: 'green', frequency: 117.466, radius }),
          new Note({ audioContext, color: 'blue', frequency: 131.85, radius }),
          new Note({ audioContext, color: 'indigo', frequency: 139.692, radius }),
        ],
        noteTriggers : [
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : 0, beats : 4, radius }),
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 1, position : (Math.PI*0.5), beats : 4, radius }),
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 2, position : Math.PI, beats : 4, radius }),
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 3, position : Math.PI*1.5, beats : 4, radius }),
        ],
      }),
      new Section({
        audioContext,
        bpm,
        masterAudioNode,
        unlockPattern : [0, 1, 0, 2, 0, 3],
        noteTriggers : [
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : 0, beats : 2, radius }),
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : Math.PI / 2, beats : 4, radius }),
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : Math.PI, beats : 6, radius }),
          new NoteTrigger({ masterAudioNode, noteDuration : 100, startDelay: 0, position : Math.PI * 2, beats : 8, radius }),
        ],
        notes : [
          new Note({ audioContext, color: 'red', frequency: 88, radius }),
          new Note({ audioContext, color: 'orange', frequency: 98.776, radius }),
          new Note({ audioContext, color: 'green', frequency: 117.466, radius }),
          new Note({ audioContext, color: 'indigo', frequency: 139.692, radius }),
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
