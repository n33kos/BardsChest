function initGame() {
  // Init classes
  const GameState = new HEART.GameState();
  const UI = new HEART.UI(GameState);

  // Select Main Menu
  window.setTimeout(function(){ UI.setScreen('mainmenu'); }, 1000 );

  // Add listenters
  UI.initListenters();
}

document.addEventListener("DOMContentLoaded", function(event) {
  initGame();
});
