---
title: Index
layout: base.njk
permalink: /index.html
---

<section class="dos-directory">
<pre>
D:\>DIR

Volume in drive D is RIZOMORF
Volume Serial Number is 2024-01-19

 Directory of D:\

25-01-15  02:33p    <DIR>          BLOG
09-06-25  02:33p    <DIR>          UX_WORK
82-06-30  02:33p         1,337     ABOUT.TXT
25-01-12  02:33p           420     FAQ.TXT
65-12-27  02:33p    <DIR>          SPACEWAR
          2 File(s)      1,757 bytes
          3 Dir(s)   640K bytes free
</pre>

<div id="dos-prompt-index"></div>
</section>

<section>

## newsletter signup
<div id="convertkit-form-container">
    <script async data-uid="bd10f8c849" src="https://dominickennedy.kit.com/bd10f8c849/index.js"></script>
</div>

</section>

<style>
.dos-directory pre {
    margin: 2rem 0;
    white-space: pre;
    font-family: 'DOS', monospace;
    color: var(--dos-yellow);
    border: none;
    padding: 0;
}
.dos-directory a {
    text-decoration: none;
    color: var(--dos-yellow);
}
.dos-directory a:hover {
    color: var(--dos-green);
}

#dos-prompt-index {
    margin-top: -1rem;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const pre = document.querySelector('.dos-directory pre');
    if (!pre) return;
    
    const text = pre.textContent.trim();
    pre.textContent = '';
    
    let i = 0;
    const typeSpeed = 25; // Slightly slower for better readability
    
    function typeChar() {
        if (i < text.length) {
            pre.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, typeSpeed);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeChar, 500);

    // Move the DOS prompt to the index location
    const bottomPrompt = document.getElementById('dos-prompt');
    const indexPrompt = document.getElementById('dos-prompt-index');
    if (bottomPrompt && indexPrompt) {
        indexPrompt.appendChild(bottomPrompt);
        bottomPrompt.style.position = 'static';
        bottomPrompt.style.margin = '0';
        bottomPrompt.style.padding = '0';
    }
});
</script>

