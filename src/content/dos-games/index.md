---
title: DOS Games
layout: base.njk
permalink: /dos-games/index.html
---

# DOS Games

<section>

## Available Games
Loading game library...

<div id="dosbox-container">
  <canvas id="jsdos"></canvas>
</div>

<script src="https://js-dos.com/6.22/current/js-dos.js"></script>
<script>
  const dosbox = document.getElementById('jsdos');
  
  // Initialize js-dos
  Dos(dosbox).ready((fs, main) => {
    // We'll add game loading logic here
    console.log('DOS emulator ready');
  });
</script>

<style>
  #dosbox-container {
    width: 640px;
    height: 400px;
    max-width: 100%;
    margin: 2rem auto;
    border: 2px solid var(--dos-yellow);
  }
  
  #jsdos {
    width: 100%;
    height: 100%;
  }
</style>

## Instructions
1. Select a game from the list above
2. Click to start the emulator
3. Use keyboard controls:
   - Arrow keys for movement
   - Enter/Space for action
   - ESC to exit
   - Alt+Enter for fullscreen

## Coming Soon
- Prince of Persia
- Commander Keen
- Oregon Trail
- Wolfenstein 3D

Note: All games are provided for educational purposes only.
</section> 