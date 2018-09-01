export default class {
  constructor(GameState) {
    this.GameState = GameState;
    this.screens = document.querySelectorAll('.Screen');
    this.buttons = {
      quit : document.querySelectorAll('[data-nav="quit"]'),
    };
  }

  initListenters() {
    // Quit buttons
    Array.from(this.buttons.quit).forEach(button => {
      button.addEventListener('click', () => window.close() );
    });
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
