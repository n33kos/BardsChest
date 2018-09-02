export default class {
  constructor(GameState) {
    this.GameState = GameState;

    this.screens = document.querySelectorAll('.Screen');
    this.buttons = {
      mute        : document.querySelectorAll('[data-nav="mute"]'),
      quit        : document.querySelectorAll('[data-nav="quit"]'),
      transitions : document.querySelectorAll('[data-target-screen]'),
      play        : document.querySelectorAll('[data-gamestate-play]'),
      pause       : document.querySelectorAll('[data-gamestate-pause]'),
    };
  }

  init() {
    this.initListenters();
    this.setScreen('mainmenu');

    this.updateScore();
    this.updatePlayerName();
    this.updateLevel();
  }

  initListenters() {
    // Play buttons
    Array.from(this.buttons.play).forEach(button => {
      button.addEventListener('click', () => this.GameState.GamePlay.play() );
    });

    // Pause buttons
    Array.from(this.buttons.pause).forEach(button => {
      button.addEventListener('click', () => this.GameState.GamePlay.togglePause() );
    });

    // Quit buttons
    Array.from(this.buttons.quit).forEach(button => {
      button.addEventListener('click', () => window.close() );
    });

    // Mute Buttons
    Array.from(this.buttons.mute).forEach(button => {
      button.addEventListener('click', (e) => {
        const audioCtx = this.GameState.GamePlay.audioContext;
        if(audioCtx.state === 'running') {
          audioCtx.suspend().then(function() {
            e.target.innerHTML = 'Resume';
          });
        } else if(audioCtx.state === 'suspended') {
          audioCtx.resume().then(function() {
            e.target.innerHTML = 'Mute';
          });
        }
      });
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

  updateScore() {
    document.querySelector('[data-ui="score"]').innerHTML = this.GameState.score;
  }

  updatePlayerName() {
    document.querySelector('[data-ui="playerName"]').innerHTML = this.GameState.playerName;
  }

  updateLevel() {
    document.querySelector('[data-ui="level"]').innerHTML = this.GameState.level;
  }
}
