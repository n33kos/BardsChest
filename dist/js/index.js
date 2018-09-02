function initGame() {
  // Init classes
  const GameState = new HEART.GameState();
  GameState.UI = new HEART.UI(GameState);
  GameState.GamePlay = new HEART.GamePlay(GameState);

  // Init Game
  GameState.UI.init();
  GameState.GamePlay.init();

  // Start rendering the game in a bit
  window.setTimeout(GameState.GamePlay.render.bind(GameState.GamePlay), 100);
}

document.addEventListener("DOMContentLoaded", function(event) {
  initGame();
});
