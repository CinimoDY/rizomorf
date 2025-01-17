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
  <div id="loading-message" style="display: none;">Loading game...</div>
</div>

<script src="https://js-dos.com/6.22/current/js-dos.js"></script>
<script>
  const dosbox = document.getElementById('jsdos');
  const loadingMessage = document.getElementById('loading-message');
  let ci = null;
  
  // Initialize js-dos
  Dos(dosbox).ready((fs, main) => {
    console.log('DOS emulator ready');
  });

  async function loadGame(game) {
    loadingMessage.style.display = 'block';
    
    if (ci) {
      await ci.exit();
    }
    
    try {
      ci = await Dos(dosbox, { 
        wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
        cycles: "max 100000",
        autolock: false,
        sound: true,
        socketURL: "wss://js-dos.com/6.22/current/wdosbox.js",
        canvas: dosbox,
        logging: false,
        scaleFactor: 2
      });
      
      await ci.mount(`/games/${game}`);
      await ci.run(`${game}/SPACEWAR.EXE`);
      loadingMessage.style.display = 'none';
    } catch (e) {
      console.error("Game loading failed:", e);
      alert("Failed to load game. Please try again.");
      loadingMessage.style.display = 'none';
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
  }
  
  #jsdos {
    width: 100%;
    height: 100%;
    background: #000;
  }

  #loading-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--dos-yellow);
    font-family: 'DOS', monospace;
    text-transform: uppercase;
  }

  .game-link {
    color: var(--dos-yellow);
    text-decoration: underline;
    cursor: pointer;
  }

  .game-link:hover {
    color: var(--dos-white);
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