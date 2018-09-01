export default class {
  constructor(GameState) {
    this.GameState = GameState;
    this.screens = document.querySelectorAll('.Screen');
    this.buttons = {
      quit        : document.querySelectorAll('[data-nav="quit"]'),
      transitions : document.querySelectorAll('[data-target-screen]'),
    };
  }

  init() {
    this.initListenters();
    this.setScreen('mainmenu');
  }

  initListenters() {
    // Quit buttons
    Array.from(this.buttons.quit).forEach(button => {
      button.addEventListener('click', () => window.close() );
    });

    // UI Transitions
    Array.from(this.buttons.transitions).forEach(button => {
      button.addEventListener('click', this.initTransitions.bind(this));
    });
  }

  initTransitions(e) {
    this.setScreen(e.target.dataset.targetScreen);
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
