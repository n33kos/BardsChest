import Game      from './gamestate/game/index';
import GameState from './gamestate/index';
import UI        from './gamestate/ui/index';

const HEART = {
  GameState,
  Game,
  UI,
};

const initGame = () => {
  const GameState = new HEART.GameState();
  GameState.Game = new HEART.Game(GameState);
  GameState.UI = new HEART.UI(GameState);

  GameState.UI.init();
}

document.addEventListener("DOMContentLoaded", function(event) {
  initGame();
});
