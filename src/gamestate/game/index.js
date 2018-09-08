import areArraysIdentical    from '../../utils/areArraysIdentical';
import Control               from './control/index';
import oneBeatInMilliseconds from '../../utils/oneBeatInMilliseconds';

import Level1                from './level/levels/level-1';

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
    this.levels = [];
    this.levelProgress = 0;
    this.mass = 8000;
    this.masterAudioNode = null;
    this.momentum = 0;
    this.radius = Math.min(window.innerWidth / 3, window.innerHeight / 3);
    this.rotation = 0;
    this.sectionKey = [];
    this.section = null;
    this.sectionProgress = 0;
    this.deltaTime = 0;
    this.lastUpdate = Date.now();
    this.isRunning = false;
    this.images = {
      center: {url : `${window.location.href}img/center.png`, image: null},
    };

    this.initCanvas();
    this.initAudio();
    this.initControls();
    this.loadImages();
    this.importLevels();
  }

  // --------------------Helpers----------------
  play() {
    this.loadLevel();
    this.startRenderLoops();
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
  importLevels() {
    this.levels.push(
      Level1({
        audioContext    : this.audioContext,
        GameState       : this.GameState,
        masterAudioNode : this.masterAudioNode,
        radius          : this.radius,
      }),
    );
  }

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
    if (!this.isRunning) {
      this.isRunning = true;
      this.audioRender();
      this.render();
    };
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
    this.level = this.levels[this.GameState.level];
    this.sectionSubtention = this.fullCircleRadian / this.level.sections[this.levelProgress].notes.length;
    this.GameState.UI.updateBPM(this.level.bpm);
    this.GameState.UI.updateLevel(this.levelProgress);
    this.level.load();
    this.loadSection();
  }

  loadSection() {
    this.section = this.level.sections[this.levelProgress]
    this.sectionSubtention = this.fullCircleRadian / this.level.sections[this.levelProgress].notes.length;
  }

  // --------------------Renders----------------
  shouldRenderGameplay(section) {
    return !this.isPaused
    && this.level !== null
    && this.level.isLoaded === true
    && section;
  }

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
    if(!this.shouldRenderGameplay(this.section)) return;

    // Draw level specific elements
    this.section.notes.forEach((note, i) => {
      note.render(this.cx, this.cy, this.ctx, i, this.sectionSubtention, this.rotation);
    });

    this.section.noteTriggers.forEach(trigger => {
      trigger.render(this.cx, this.cy, this.ctx);
    });
  }

  audioRender() {
    // Set timeout for next beat
    setTimeout(this.audioRender.bind(this), this.getAudioRenderFrequency());

    // Bail out early
    if(!this.shouldRenderGameplay(this.section)) return;

    // play background track
    this.section.beatCounter++;
    if(this.section.beatCounter > this.section.beats) {
      this.section.beatCounter = 1;
      this.section.audioNode.play();
    }

    // Render NoteTrigger
    this.section.noteTriggers.forEach(trigger => {
      const mergeData = trigger.audioRender(
        this.section,
        this.sectionProgress,
        this.sectionKey,
        this.rotation,
      );
      this.sectionProgress = mergeData.sectionProgress;
      this.GameState.score = Math.min(this.GameState.score - mergeData.score, 0);
      this.GameState.UI.updateScore(this.GameState.score);

      // Win condition!
      if (this.levelProgress >= this.level.sections.length) {
        this.GameState.UI.setScreen('score');
        setTimeout(() => this.isPaused = true, 250);
      }

      // Section Complete condition!
      if (areArraysIdentical(this.sectionKey, this.section.unlockPattern )) {
        this.levelProgress++;
        this.sectionKey = [];
        this.sectionProgress = 0;
        this.loadSection();
      }
    });
  }
}
