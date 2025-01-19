---
title: DOS Games
layout: base.njk
permalink: /dos-games/index.html
---

# DOS Games

<section>

## Available Games
- [Space War](javascript:loadGame('spacewar'))

<div id="dosbox-container">
  <canvas id="jsdos"></canvas>
  <div id="loading-message">Loading emulator...</div>
  <div id="status-message"></div>
</div>

<script src="https://js-dos.com/6.22/current/js-dos.js"></script>
<script>
  const dosbox = document.getElementById('jsdos');
  const loadingMessage = document.getElementById('loading-message');
  const statusMessage = document.getElementById('status-message');
  let ci = null;
  
  // Initialize js-dos with basic configuration
  const dos = Dos(dosbox, {
    wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js"
  });

  dos.ready((fs, main) => {
    loadingMessage.style.display = 'none';
    statusMessage.textContent = 'Click Space War to start';
  });

  async function loadGame(game) {
    statusMessage.textContent = 'Loading game...';
    
    if (ci) {
      await ci.exit();
    }
    
    try {
      ci = await dos;
      
      // Mount the game directory
      await ci.mount('games');
      
      // Run the game
      await ci.run('spacewar/SPACEWAR.EXE');
      
      statusMessage.textContent = 'Game loaded!';
    } catch (e) {
      console.error("Game loading failed:", e);
      statusMessage.textContent = 'Failed to load game. Please try again.';
    }
  }
</script>

<style>
  #dosbox-container {
    width: 640px;
    height: 400px;
    max-width: 100%;
    margin: 2rem auto;
    border: 2px solid var(--dos-yellow);
    position: relative;
    background-color: var(--dos-black);
  }
  
  #jsdos {
    width: 100%;
    height: 100%;
    background-color: var(--dos-black);
  }

  #loading-message,
  #status-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--dos-yellow);
    font-family: "Courier New", monospace;
    text-transform: uppercase;
    background-color: var(--dos-black);
    padding: 1rem;
    border: 1px solid var(--dos-yellow);
  }

  .game-link {
    color: var(--dos-yellow);
    text-decoration: underline;
    cursor: pointer;
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 1px solid var(--dos-yellow);
    margin: 1rem 0;
  }

  .game-link:hover {
    background-color: var(--dos-yellow);
    color: var(--dos-black);
  }
</style>

## Instructions
1. Click on "Space War" above to start the game
2. Use keyboard controls:
   - Arrow keys for movement
   - Space for shooting
   - ESC to exit
   - Alt+Enter for fullscreen
   - Ctrl+F11/F12 to adjust speed

## About Space War
Space War is a classic DOS game based on the original 1962 Spacewar! created at MIT. Two players control spaceships that fire missiles at each other while dealing with the gravitational pull of a central star. The game features simple but engaging gameplay that captures the essence of early computer gaming.

Note: This game is provided for educational purposes only.
</section> 