import Control               from './control/index';
import Level                 from './level/index';
import oneBeatInMilliseconds from '../../utils/oneBeatInMilliseconds';

export default class {
  constructor(GameState) {
    this.GameState = GameState;

    this.audioContext = null;
    this.canvas = null;
    this.ctx = null;
    this.drag = 0.1;
    this.fullCircleRadian = Math.PI * 2;
    this.isPaused = false;
    this.level = null;
    this.levelProgress = 0;
    this.mass = 0.005;
    this.masterAudioNode = null;
    this.momentum = 0;
    this.rotation = 0;
    this.sectionProgress = 0;

    this.initCanvas();
    this.initAudio();
    this.initControls();
    this.startRenderLoops();
  }

  // --------------------Helpers----------------
  play() {
    this.loadLevel();
  }

  togglePause() {
    this.isPaused ? this.audioContext.resume() : this.audioContext.suspend();
    this.isPaused = !this.isPaused;
  }

  getAudioRenderFrequency() {
    if (this.level === null) return 500;
    return oneBeatInMilliseconds(this.level.bpm);
  }

  loopValue(val, min, max) {
    const p = max - min;
    let mod = (val - min) % p;
    if (mod < 0) mod += p;
    return min + mod;
  }

  getNoteForPosition(position, rotation) {
    const noteSectionLength = (Math.PI * 2 / this.level.sections[this.levelProgress].notes.length);
    const fullCircle = Math.PI * 2;
    let cleanRotation = this.loopValue(rotation + position, 0, fullCircle);
    let index = Math.abs(Math.floor(cleanRotation / noteSectionLength));

    return this.level.sections[this.levelProgress].notes[index];
  }

  physics() {
    this.rotation += (this.momentum * this.mass);
    this.momentum = this.momentum - (this.momentum * this.drag);
  }

  // --------------------Inits----------------
  initCanvas() {
    let canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ctx = canvas.getContext('2d');
    this.cx = ctx.canvas.width/2;
    this.cy = ctx.canvas.height/2;
    this.canvas = canvas;
    this.ctx = ctx;
  }

  initAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioContext = audioContext;

    const master = audioContext.createGain();
    master.gain.value = 0.75;
    master.connect(audioContext.destination);
    this.masterAudioNode = master;
  }

  initControls() {
    this.control = new Control(this);
    this.control.init();
  }

  startRenderLoops() {
    this.audioRender();
    this.render();
  }

  // --------------------Loaders----------------
  loadLevel() {
    // This will be moved to individual files with an importer
    const level = new Level({
      audioContext    : this.audioContext,
      masterAudioNode : this.masterAudioNode,
    });

    level.load().then(() => {
      this.level = level;
      this.sectionSubtention = this.fullCircleRadian / this.level.sections[this.levelProgress].notes.length;
      this.GameState.UI.updateBPM(this.level.bpm);
      this.GameState.UI.updateLevel(this.levelProgress);
    });
  }

  loadSection() {
    this.sectionSubtention = this.fullCircleRadian / this.level.sections[this.levelProgress].notes.length;
  }

  // --------------------Renders----------------
  render() {
    window.requestAnimationFrame(this.render.bind(this));
    if(this.isPaused || this.level === null) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.physics();

    this.level.sections[this.levelProgress].notes.forEach((note, i) => {
      note.render(this.cx, this.cy, this.ctx, i, this.sectionSubtention, this.rotation);
    });

    this.level.sections[this.levelProgress].noteTriggers.forEach(trigger => {
      trigger.render(this.cx, this.cy, this.ctx);
    });
  }

  audioRender() {
    // Set timeout for next beat
    const frequency = this.getAudioRenderFrequency();
    setTimeout(this.audioRender.bind(this), frequency);

    // Bail out if paused or no level is loaded
    if(this.isPaused || this.level === null) return;

    // Handle Background Music
    const section = this.level.sections[this.levelProgress];

    // Bail out if no more sections
    if(!section) return;

    section.beatCounter++;

    if(section.beatCounter > section.beats) {
      section.beatCounter = 1;
      this.level.sections[this.levelProgress].buffer.play(frequency);
    }

    // Handle individual notes
    this.level.sections[this.levelProgress].noteTriggers.forEach(trigger => {
      trigger.beatCounter++;

      if(trigger.beatCounter > trigger.beats) {
        trigger.beatCounter = 1;
        trigger.note = this.getNoteForPosition(trigger.position, this.rotation);

        if (trigger.nextNote !== null && trigger.note !== trigger.nextNote) {
          // Reset section progress
          this.sectionProgress = 0;

          // Reset all nextNotes
          this.level.sections[this.levelProgress].noteTriggers.forEach(trigger => {
            trigger.nextNote = null;
          });

          this.GameState.score += 8;
        }

        if (trigger.nextNote !== null && trigger.note === trigger.nextNote) {
          this.GameState.score += 10;
        }

        if (trigger.nextNote) trigger.fire();

        trigger.nextNote = this.level.sections[this.levelProgress].notes[
          this.level.sections[this.levelProgress].unlockPattern[this.sectionProgress]
        ];

        if (this.sectionProgress > this.level.sections[this.levelProgress].unlockPattern.length) {
          // Section Complete condition!
          this.levelProgress++;
          this.loadSection();
          this.sectionProgress = 0;
        }

        if (this.levelProgress >= this.level.sections.length) {
          // Win condition!
          this.GameState.UI.setScreen('score');
          setTimeout(() => this.isPaused = true, 250);
        }

        this.sectionProgress++;
        trigger.startTime = Date.now();
        trigger.endTime = Date.now() + (oneBeatInMilliseconds(this.level.bpm) * trigger.beats);
        this.GameState.UI.updateScore(this.GameState.score);
      }
    });
  }
}
