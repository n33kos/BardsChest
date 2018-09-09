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
      restart     : document.querySelectorAll('[data-gamestate-restart]'),
      fullscreen  : document.querySelectorAll('[data-nav="fullscreen"]'),
    };
    this.isFullscreen = false;
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
      button.addEventListener('click', () => this.GameState.Game.play() );
    });

    // Pause buttons
    Array.from(this.buttons.pause).forEach(button => {
      button.addEventListener('click', () => this.GameState.Game.togglePause() );
    });

    // Restart Buttons
    Array.from(this.buttons.restart).forEach(button => {
      button.addEventListener('click', () => this.GameState.Game.restart() );
    });

    //Fullscreen buttons
    Array.from(this.buttons.fullscreen).forEach(button => {
      button.addEventListener('click', () => this.toggleFullscreen() );
    });


    // Quit buttons
    Array.from(this.buttons.quit).forEach(button => {
      button.addEventListener('click', () => window.close() );
    });

    // Mute Buttons
    Array.from(this.buttons.mute).forEach(button => {
      button.addEventListener('click', (e) => {

        const audioCtx = this.GameState.Game.audioContext;

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

  toggleFullscreen() {
    const elem = document.documentElement;

    /* View in fullscreen */
    if(!this.isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }

    /* Close fullscreen */
    if(this.isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    }

    this.isFullscreen = !this.isFullscreen;
  }

  updateScore(score) {
    document.querySelector('[data-ui="score"]').innerHTML = score;
  }

  updatePlayerName() {
    document.querySelector('[data-ui="playerName"]').innerHTML = this.GameState.playerName;
  }

  updateLevel(level) {
    document.querySelector('[data-ui="level"]').innerHTML = level;
  }

  updateBPM(bpm) {
    document.querySelector('[data-ui="bpm"]').innerHTML = bpm;
  }

  updateIndicators(unlockPattern, sectionKey, notes) {
    const indicators = document.querySelector('.Indicators');
    const length = unlockPattern.length;
    indicators.innerHTML = null;

    unlockPattern.forEach((noteIndex, index) => {
      const div = document.createElement('div');
      div.classList.add('Indicator');
      div.style.backgroundColor = notes[noteIndex].color;

      if (sectionKey[index] !== noteIndex) {
        div.style.opacity = 0.35;
      }

      indicators.appendChild(div);
    });
  }
}
