import Level from '../level/index';

export default class {
  constructor(GameState) {
    this.GameState = GameState;

    this.audioContext = null;
    this.canvas = null;
    this.ctx = null;
    this.isMouseDown = false;
    this.level = null;
    this.masterAudioNode = null;
    this.oldMousePos = 0;
    this.rotation = 0;
    this.isPaused = false;
  }

  play() {
    this.initCanvas();
    this.initAudio();
    this.initControls();
    this.loadLevel();
    this.render()
  }

  togglePause() {
    this.isPaused ? this.audioContext.resume() : this.audioContext.suspend();
    this.isPaused = !this.isPaused;
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
  }

  initAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioContext = audioContext;

    const master = audioContext.createGain();
    master.gain.value = 0.75;
    master.connect(audioContext.destination);
    this.masterAudioNode = master;
  }

  loadLevel() {
    this.level = new Level({
      audioContext    : this.audioContext,
      backgroundTrack : [{ beats : 4, url : 'metronome-100-bpm.ogg' }],
      masterAudioNode : this.masterAudioNode,
    });
    this.level.start();
  }

  initControls() {
    document.body.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.body.addEventListener("mousedown", e => {
      this.isMouseDown = true;
      this.oldMousePos = e.clientX;
    });
    document.body.addEventListener("mouseup", e => { this.isMouseDown = false; });
  }

  handleMouseMove(e) {
    if (!this.isMouseDown || this.isPaused) return;

    // Set rotation from mouse movement
    this.rotation += (this.oldMousePos - e.clientX) * 0.01;
    if (this.rotation > Math.PI*2) this.rotation = this.rotation % (Math.PI * 2);
    this.oldMousePos = e.clientX;

    if (this.level !== null) this.level.setNotesForTriggers(this.rotation);
  }

  drawNotes() {
    let fullCircleRadian = Math.PI * 2;
    let section = fullCircleRadian / this.level.notes.length;

    this.level.notes.forEach((note, i) => {
      let start = section * i;
      let end = start + section;

      this.ctx.beginPath();
      this.ctx.arc(this.cx, this.cy, this.cx/2, (start - this.rotation), (end - this.rotation));
      this.ctx.fillStyle = note.color;
      this.ctx.fill();
    });
  }

  drawNoteTriggers() {
    this.level.noteTriggers.forEach(trigger => {
      this.ctx.beginPath();
      this.ctx.arc(this.cx, this.cy, (this.cx/2 + 20), trigger.position, trigger.position+(0.025));
      this.ctx.strokeStyle = trigger.color;
      this.ctx.stroke();
    });
  }

  render() {
    if(!this.isPaused) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawNotes();
      this.drawNoteTriggers();
    }

    window.requestAnimationFrame(this.render.bind(this));
  }
}
