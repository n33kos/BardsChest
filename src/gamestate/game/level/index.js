import AudioBuffer from './audioBuffer/index';

export default class {
  constructor({
    audioContext,
    bpm,
    GameState,
    masterAudioNode,
    radius,
    sections,
  }) {
    this.audioContext = audioContext;
    this.bpm = bpm;
    this.GameState = GameState;
    this.masterAudioNode = masterAudioNode;
    this.radius = radius;
    this.sections = sections;
    this.isLoaded = false;
    this.notes = {};
  }

  testIsLoaded() {
    const areAllFilesLoaded = this.sections.every(section => {
      return section.audioNode !== null
        && section.notes.every(note => note.audioNode !== null)
    });

    if (areAllFilesLoaded) this.isLoaded = true;
  }

  load() {
    this.sections.forEach(section => {
      // Load section Background track
      section.audioNode = new AudioBuffer({
        audioContext    : this.audioContext,
        audioFileUrl    : section.url,
        masterAudioNode : this.masterAudioNode,
      });
      section.audioNode.load(this.testIsLoaded.bind(this));

      // Load section notes
      section.notes.forEach(note => {
        if (note.url in this.notes) {
          note = this.notes[note.url];
          this.testIsLoaded.bind(this);
        }else{
          note.audioNode = new AudioBuffer({
            audioContext    : this.audioContext,
            audioFileUrl    : note.url,
            masterAudioNode : this.masterAudioNode,
          });
          note.audioNode.load(this.testIsLoaded.bind(this));
          this.notes[note.url] = note;
        }
      })
    });
  }
}
