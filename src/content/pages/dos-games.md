---
title: DOS Games
layout: base.njk
permalink: /dos-games/index.html
---

# DOS Games

<section>

## Available Games

### Spacewar
> A classic space combat game where two players battle in a gravity field
[LAUNCH SPACEWAR]({{ baseUrl }}/games/spacewar/index.html)

<div id="dosbox-container">
  <canvas id="jsdos"></canvas>
</div>

<script src="https://js-dos.com/6.22/current/js-dos.js"></script>
<script>
  const dosbox = document.getElementById('jsdos');
  
  // Initialize js-dos
  Dos(dosbox).ready((fs, main) => {
    // Load Spacewar when clicked
    document.querySelector('a[href*="spacewar"]').addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await fs.createFile("spacewar.zip", await fetch("{{ baseUrl }}/games/spacewar/spacewar.zip"));
        main(["-c", "cd spacewar", "-c", "spacewar.exe"]);
      } catch (error) {
        console.error('Error loading game:', error);
        alert('Error loading game. Please try again.');
      }
    });
  });
</script>

<style>
  #dosbox-container {
    width: 640px;
    height: 400px;
    max-width: 100%;
    margin: 2rem auto;
    border: 2px solid var(--dos-yellow);
    display: none;
  }
  
  #jsdos {
    width: 100%;
    height: 100%;
  }
  
  #dosbox-container.active {
    display: block;
  }
</style>

## Instructions
1. Click the LAUNCH button above to start the game
2. Use keyboard controls:
   - Arrow keys for movement
   - Space to fire
   - ESC to exit
   - Alt+Enter for fullscreen

## Coming Soon
- Commander Keen
- Oregon Trail
- Wolfenstein 3D

Note: All games are provided for educational purposes only.
</section> 