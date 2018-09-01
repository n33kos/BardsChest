function initGame() {
  // Init classes
  const GameState = new HEART.GameState();
  GameState.UI = new HEART.UI(GameState);

  // Init Game
  GameState.UI.init();
}

document.addEventListener("DOMContentLoaded", function(event) {
  initGame();
});
