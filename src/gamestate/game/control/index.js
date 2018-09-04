export default class {
  constructor(Game) {
    this.Game = Game;
    this.isMouseDown = false;
    this.oldMousePos = 0;
    this.direction = 1;
  }

  init() {
    document.body.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.body.addEventListener("mousedown", e => {
      this.isMouseDown = true;
      this.oldMousePos = e.clientX;
      this.direction = e.clientY > this.Game.ctx.canvas.height/2 ? -1 : 1;
    });
    document.body.addEventListener("mouseup", e => { this.isMouseDown = false; });
    document.onkeydown = this.handleKeypress.bind(this);
  }

  handleMouseMove(e) {
    if (!this.isMouseDown || this.Game.isPaused) return;

    this.Game.momentum += (this.oldMousePos - e.clientX) * this.direction * this.Game.deltaTime;
    this.oldMousePos = e.clientX;
  }

  handleKeypress(e) {
    e = e || window.event;

    if (this.Game.isPaused || this.Game.level === null) return;
    const rotationSpeed = 50;

    if (e.keyCode == '38') {
      // up arrow
    }
    if (e.keyCode == '40') {
      // down arrow
    }
    if (e.keyCode == '37') {
      // left arrow
      this.Game.momentum += rotationSpeed * this.Game.deltaTime;
    }
    if (e.keyCode == '39') {
      // right arrow
      this.Game.momentum -= rotationSpeed * this.Game.deltaTime;
    }
  }
}
