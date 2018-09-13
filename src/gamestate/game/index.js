import areArraysIdentical    from '../../utils/areArraysIdentical';
import Control               from './control/index';
import oneBeatInMilliseconds from '../../utils/oneBeatInMilliseconds';

import Level1                from './level/levels/level-1';
import Level2                from './level/levels/level-2';
import Level3                from './level/levels/level-3';

export default class {
  constructor(GameState) {
    this.GameState = GameState;

    this.audioContext = null;
    this.canvas = null;
    this.ctx = null;
    this.drag = 0.10;
    this.fullCircleRadian = Math.PI * 2;
    this.glowAlpha = 0;
    this.isPaused = false;
    this.level = null;
    this.levels = [];
    this.levelProgress = 0;
    this.mass = 8000;
    this.masterAudioNode = null;
    this.momentum = 0;
    this.rotation = 0;
    this.sectionKey = [];
    this.section = null;
    this.sectionProgress = 0;
    this.deltaTime = 0;
    this.lastUpdate = Date.now();
    this.isRunning = false;
    this.isFirstBeat = true;
    this.images = {
      center: {url : `${window.location.href}img/center.png`, image: null},
      centerGlow: {url : `${window.location.href}img/centerGlow.png`, image: null},
    };

    this.setDimensions();
    this.radius = Math.sqrt((this.width/2)*(this.width/2) + (this.height/2)*(this.height/2)) / 3;

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
    this.glowAlpha = 0;
    this.isPaused = false;
    this.level = null;
    this.levelProgress = 0;
    this.momentum = 0;
    this.rotation = 0;
    this.sectionKey = [];
    this.section = null;
    this.sectionProgress = 0;
    this.deltaTime = 0;
    this.lastUpdate = Date.now();
    this.isFirstBeat = true;
    this.GameState.score = 0;
    this.loadLevel();

    this.section.noteTriggers.forEach(trigger => {
      trigger.beatCounter = trigger.beats - trigger.startDelay;
      trigger.recalculateEndTime();
    });
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    //Trigger events on unpause
    if (!this.isPaused) {
      this.audioContext.resume();
      this.section.noteTriggers.forEach(trigger => trigger.recalculateEndTime());
    }


    //Trigger events on pause
    if (this.isPaused) {
      this.audioContext.suspend();
    }
  }

  getAudioRenderFrequency() {
    if (this.level === null) return 500;
    return oneBeatInMilliseconds(this.level.bpm);
  }

  resizeCanvas() {
    this.setDimensions();

    this.canvas.width = this.width;
  	this.canvas.height = this.height;
    this.cx = this.width/2;
    this.cy = this.height/2;
    this.radius = Math.sqrt((this.width/2)*(this.width/2) + (this.height/2)*(this.height/2)) / 3;

    //Update radius for all notes and triggers
    this.level.load(this.radius);
    this.level.sections.forEach(section => {
      section.noteTriggers.forEach(trigger => trigger.radius = this.radius / 2);
      section.notes.forEach(note => note.radius = this.radius / 2);
    });
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

    if (this.images.centerGlow.image !== null && this.glowAlpha > 0.01) {
      this.glowAlpha = Math.max(this.glowAlpha - 0.01, 0);
      this.ctx.globalAlpha = this.glowAlpha;
      this.ctx.translate(this.cx, this.cy);
      this.ctx.rotate(-this.rotation);
      this.ctx.drawImage(this.images.centerGlow.image, -this.radius/2, -this.radius/2, this.radius, this.radius);
      this.ctx.resetTransform();
      this.ctx.globalAlpha = 1;
    }
  }

  triggerCenterGlow(value) {
    this.glowAlpha = value;
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
      Level2({
        audioContext    : this.audioContext,
        GameState       : this.GameState,
        masterAudioNode : this.masterAudioNode,
        radius          : this.radius,
      }),
      Level3({
        audioContext    : this.audioContext,
        GameState       : this.GameState,
        masterAudioNode : this.masterAudioNode,
        radius          : this.radius,
      }),
    );
  }

  initCanvas() {
    let canvas = document.querySelector('canvas');
    canvas.width = this.width;
    canvas.height = this.height;

    let ctx = canvas.getContext('2d');
    this.cx = this.width/2;
    this.cy = this.height/2;
    this.canvas = canvas;
    this.ctx = ctx;


    window.addEventListener('resize', () => {
      this.setDimensions();
      this.resizeCanvas();
    });
  }

  setDimensions() {
    this.width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    this.height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
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
    this.GameState.UI.updateBPM(this.level.bpm);
    this.level.load();
    this.loadSection();
  }

  loadSection() {
    // Set sectionProgress
    if (this.levelProgress < this.level.sections.length) {
      this.section = this.level.sections[this.levelProgress];
    }

    // Run Loader functions
    this.section.load();
    this.section.noteTriggers.forEach(trigger => trigger.load());
    this.section.notes.forEach(note => note.load());

    // Set local vars
    this.sectionSubtention = this.fullCircleRadian / this.section.notes.length;
    this.GameState.UI.updateIndicators(this.section.unlockPattern, this.sectionKey, this.section.notes);
  }

  // --------------------Renders----------------
  shouldRenderGameplay() {
    return !this.isPaused
    && this.level !== null
    && this.level.isLoaded === true
    && this.section;
  }

  render() {
    // Request new frame
    window.requestAnimationFrame(this.render.bind(this));

    // Bail out early
    if(!this.shouldRenderGameplay()) return;

    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculations
    this.calculateDeltaTime();
    this.physics();

    // Draw non-level specific elements
    this.drawGameObjects();

    // Handle keypresses
    this.control.handlePressedKeys();

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
    if(!this.shouldRenderGameplay()) return;

    if (this.isFirstBeat) {
      this.section.noteTriggers.forEach(trigger => trigger.recalculateEndTime());
      this.isFirstBeat = false;
    }

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
        this.GameState.UI.updateIndicators,
        this.triggerCenterGlow.bind(this),
      );
      this.sectionProgress = mergeData.sectionProgress;
      this.GameState.score = Math.max(0, this.GameState.score + mergeData.score);
    });
    this.GameState.UI.updateScore(this.GameState.score);

    // Section Complete condition!
    if (areArraysIdentical(this.sectionKey, this.section.unlockPattern)) {
      this.sectionKey = [];
      this.sectionProgress = 0;
      this.levelProgress++;
      this.section.audioNode.stop();
      this.GameState.UI.updateLevel(this.level.name);
      this.loadSection();
    }

    // Win condition!
    if (this.levelProgress >= this.level.sections.length) {
      this.GameState.UI.setScreen('score');
      this.momentum += 5000 * this.deltaTime;
      setTimeout(this.togglePause, oneBeatInMilliseconds(this.level.bpm) * 8);
    }
  }
}
