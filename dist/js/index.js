function initGame() {
  // Init classes
  const GameState = new HEART.GameState();
  GameState.UI = new HEART.UI(GameState);
  GameState.GamePlay = new HEART.GamePlay(GameState);

  // Init Game
  GameState.UI.init();
}

document.addEventListener("DOMContentLoaded", function(event) {
  initGame();
});
