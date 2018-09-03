export default class {
  constructor(Game) {
    this.Game = Game;
  }

  init() {
    document.body.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.body.addEventListener("mousedown", e => {
      this.Game.isMouseDown = true;
      this.Game.oldMousePos = e.clientX;
    });
    document.body.addEventListener("mouseup", e => { this.Game.isMouseDown = false; });
    document.onkeydown = this.handleKeypress.bind(this);
  }

  handleMouseMove(e) {
    if (!this.Game.isMouseDown || this.Game.isPaused) return;

    this.Game.rotation += (this.Game.oldMousePos - e.clientX) * 0.01;
    this.Game.oldMousePos = e.clientX;
  }

  handleKeypress(e) {
    e = e || window.event;

    if (this.Game.isPaused || this.Game.level === null) return;
    const rotationSpeed = Math.PI * 2 / this.Game.level.notes.length;

    if (e.keyCode == '38') {
      // up arrow
    }
    if (e.keyCode == '40') {
      // down arrow
    }
    if (e.keyCode == '37') {
      // left arrow
      this.Game.rotation += rotationSpeed;
    }
    if (e.keyCode == '39') {
      // right arrow
      this.Game.rotation -= rotationSpeed;
    }
  }
}
