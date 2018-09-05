import Control               from './control/index';
import Level                 from './level/index';
import oneBeatInMilliseconds from '../../utils/oneBeatInMilliseconds';

export default class {
  constructor(GameState) {
    this.GameState = GameState;

    this.audioContext = null;
    this.canvas = null;
    this.ctx = null;
    this.drag = 0.10;
    this.fullCircleRadian = Math.PI * 2;
    this.isPaused = false;
    this.level = null;
    this.levelProgress = 0;
    this.mass = 8000;
    this.masterAudioNode = null;
    this.momentum = 0;
    this.radius = Math.min(window.innerWidth / 3, window.innerHeight / 3);
    this.rotation = 0;
    this.sectionKey = [];
    this.sectionProgress = 0;
    this.deltaTime = 0;
    this.lastUpdate = Date.now();
    this.images = {
      center: {url : `${window.location.href}img/center.png`, image: null},
    };

    this.initCanvas();
    this.initAudio();
    this.initControls();
    this.startRenderLoops();
    this.loadImages();
  }

  // --------------------Helpers----------------
  play() {
    this.loadLevel();
  }

  restart() {
    this.level = null;
    this.levelProgress = 0;
    this.momentum = 0;
    this.rotation = 0;
    this.sectionProgress = 0;
    this.sectionKey = [];
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

  resizeCanvas(canvas) {
    this.canvas.width = window.innerWidth;
  	this.canvas.height = window.innerHeight;
    this.cx = this.ctx.canvas.width/2;
    this.cy = this.ctx.canvas.height/2;
    this.radius = Math.min(window.innerWidth / 3, window.innerHeight / 3);
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

    return {note: this.level.sections[this.levelProgress].notes[index], index};
  }

  physics() {
    this.rotation += (this.momentum / this.mass);
    this.momentum = this.momentum - (this.momentum * this.drag);
  }

  calculateDeltaTime() {
    const now = Date.now();
    this.deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;
  }

  drawGameObjects() {
    if (this.images.center.image !== null) {
      this.ctx.translate(this.cx, this.cy);
      this.ctx.rotate(-this.rotation);
      this.ctx.drawImage(this.images.center.image, -this.radius/2, -this.radius/2, this.radius, this.radius);
      this.ctx.resetTransform();
    }
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

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
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

  areArraysIdentical(arr1, arr2) {
    if(arr1.length !== arr2.length) return false;
    for(var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i]) return false;
    }

    return true;
  }

  // --------------------Loaders----------------
  loadImages() {
    Object.keys(this.images).forEach(key => {
      const image = new Image();
      image.src = this.images[key].url;
      image.onload = () => {
        this.images[key].image = image;
      }
    });
  }

  loadLevel() {
    // This will be moved to individual files with an importer
    const level = new Level({
      audioContext    : this.audioContext,
      masterAudioNode : this.masterAudioNode,
      radius          : this.radius,
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
    // Request new frame
    window.requestAnimationFrame(this.render.bind(this));

    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculations
    this.calculateDeltaTime();
    this.physics();

    // Draw non-level specific elements
    this.drawGameObjects();

    // Handle keypresses
    this.control.handlePressedKeys();

    // Bail out early
    if(this.isPaused || this.level === null) return;

    // Draw level specific elements
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

    // play background track
    section.beatCounter++;
    if(section.beatCounter > section.beats) {
      section.beatCounter = 1;
      this.level.sections[this.levelProgress].buffer.play(frequency);
    }

    // Handle individual notes
    this.level.sections[this.levelProgress].noteTriggers.forEach(trigger => {
      trigger.beatCounter++;

      if(trigger.beatCounter > trigger.beats) {
        // Reset beat counter
        trigger.beatCounter = 1;

        // Set trigger's nextnote
        trigger.nextNote = this.level.sections[this.levelProgress].notes[
          this.level.sections[this.levelProgress].unlockPattern[this.sectionProgress]
        ];

        // Get current note
        const currentNote = this.getNoteForPosition(trigger.position, this.rotation);
        trigger.note = currentNote.note;

        if (this.level.sections[this.levelProgress].unlockPattern[this.sectionProgress] === currentNote.index) {
          this.sectionKey.push(currentNote.index);
        }

        // Score and progress
        if (trigger.note !== trigger.nextNote) {
          this.GameState.score = Math.max(0, this.GameState.score-5);
        }else {
          this.GameState.score += 10;
        }

        // play the note if it exists
        if (trigger.nextNote) trigger.fire();

        // Win condition!
        if (this.levelProgress >= this.level.sections.length) {
          this.GameState.UI.setScreen('score');
          setTimeout(() => this.isPaused = true, 250);
        }

        // Section Complete condition!
        if (this.areArraysIdentical(
          this.sectionKey,
          this.level.sections[this.levelProgress].unlockPattern,
        )) {
          this.levelProgress++;
          this.sectionKey = [];
          this.sectionProgress = 0;
          this.loadSection();
        }

        //fix this is all janked up
        this.sectionProgress++;
        if (this.sectionProgress > this.level.sections[this.levelProgress].unlockPattern.length) this.sectionProgress = 0;
        console.log(this.sectionKey);

        trigger.startTime = Date.now();
        trigger.endTime = Date.now() + (oneBeatInMilliseconds(this.level.bpm) * trigger.beats);
        this.GameState.UI.updateScore(this.GameState.score);
      }
    });
  }
}
