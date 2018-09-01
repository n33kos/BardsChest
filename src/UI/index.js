export default class {
  constructor(GameState) {
    this.GameState = GameState;
    this.screens = document.querySelectorAll('.Screen');
  }

  setScreen(screenToSet) {
    Array.from(this.screens).forEach(screen => {
      if (screen.dataset.screen === screenToSet) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });
  }

}
