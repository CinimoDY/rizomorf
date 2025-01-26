---
title: SPACEWAR (DOS GAME)
layout: base.njk
permalink: /dos-games/index.html
---

# SPACEWAR (DOS GAME)

<section>

## About
> A classic space combat game where two players battle in a gravity field. This browser version is adapted from the original DOS game for modern devices including mobile.

```
C:\>LAUNCH SPACEWAR.EXE
```

<div id="dosbox-container">
  <canvas id="jsdos"></canvas>
</div>

<script src="https://js-dos.com/6.22/current/js-dos.js"></script>
<script>
  const dosbox = document.getElementById('jsdos');
  const container = document.getElementById('dosbox-container');
  
  // Initialize js-dos
  Dos(dosbox).ready((fs, main) => {
    // Load Spacewar when clicked
    const launchCommand = document.querySelector('pre code, pre');
    launchCommand.addEventListener('click', async (e) => {
      e.preventDefault();
      container.style.display = 'block';
      launchCommand.style.color = 'var(--dos-green)';
      try {
        await fs.createFile("SPACEWAR.EXE", await fetch("{{ baseUrl }}/games/spacewar/SPACEWAR.EXE"));
        main(["-c", "SPACEWAR.EXE"]);
      } catch (error) {
        console.error('Error loading game:', error);
        alert('Error loading game. Please try again.');
        launchCommand.style.color = 'var(--dos-yellow)';
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

  pre, pre code {
    cursor: pointer;
    color: var(--dos-yellow);
    margin: 1rem 0;
  }

  pre:hover, pre code:hover {
    color: var(--dos-green);
  }
</style>

## How to Play
1. Click the command above to start the game
2. Use keyboard controls:
   - Arrow keys for movement
   - Space to fire
   - ESC to exit
   - Alt+Enter for fullscreen

For mobile devices, touch controls will appear on screen.

</section> 