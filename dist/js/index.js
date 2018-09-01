document.addEventListener("DOMContentLoaded", function(event) {
  const GameState = new HEART.GameState();
  const UI = new HEART.UI(GameState);

  window.setTimeout(function(){ UI.setScreen('mainmenu'); }, 1000 );
});
