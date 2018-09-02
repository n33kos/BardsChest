import Level from '../level/index';

export default class {
  constructor(GameState) {
    this.GameState = GameState;

    let canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ctx = canvas.getContext('2d');
    this.cx = ctx.canvas.width/2;
    this.cy = ctx.canvas.height/2;
    this.canvas = canvas;
    this.ctx = ctx;

    this.rotation = 0;
    this.oldMousePos = 0;
    this.isMouseDown = false;

    // Set Up Audio
    const audioContext = new AudioContext();
    this.audioContext = audioContext;

    const master = audioContext.createGain();
    master.gain.value = 0.75;
    master.connect(audioContext.destination);
    this.masterAudioNode = master;

    // TODO: make this select each level
    this.level = new Level({
      audioContext,
      masterAudioNode : master,
    });
  }

  init() {
    this.initControls();
    this.initInterval();
  }

  initControls() {
    document.body.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.body.addEventListener("mousedown", e => {
      this.isMouseDown = true;
      this.oldMousePos = e.clientX;
    });
    document.body.addEventListener("mouseup", e => { this.isMouseDown = false; });
  }

  initInterval() {
    this.level.noteTriggers.forEach(trigger => {
      setTimeout(() => { trigger.start(); }, trigger.startDelay);
    });
  }

  handleMouseMove(e) {
    if (!this.isMouseDown) return;

    // Set rotation from mouse movement
    this.rotation += (this.oldMousePos - e.clientX) * 0.01;
    if (this.rotation > Math.PI*2) this.rotation = this.rotation % (Math.PI * 2);
    this.oldMousePos = e.clientX;

    // Set the correct note to the correct trigger
    this.level.noteTriggers.forEach(trigger => {
      trigger.note = this.getNoteForPosition(trigger.position);
    });
  }

  getNoteForPosition(position) {
    const noteSectionLength = (Math.PI * 2 / this.level.notes.length);
    let index = Math.floor((position + this.rotation) / noteSectionLength);

    // I think there is a smarter way to do this without a damned while loop
    while (index < 0) { index = this.level.notes.length + index; }
    if (index > this.level.notes.length) index = Math.floor(index % this.level.notes.length);

    return this.level.notes[Math.abs(index)];
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawNotes();
    this.drawNoteTriggers();

    window.requestAnimationFrame(this.render.bind(this));
  }
}
