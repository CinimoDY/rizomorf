---
title: Index
layout: base.njk
permalink: /index.html
---

<section class="dos-directory">

```
C:\>DIR

Volume in drive C is RIZOMORF
Volume Serial Number is 2024-01-19

 Directory of C:\

01-19-24  02:33p    <DIR>          BLOG
01-19-24  02:33p    <DIR>          UX_WORK
01-19-24  02:33p         1,337     ABOUT.TXT
01-19-24  02:33p           420     FAQ.TXT
01-19-24  02:33p    <DIR>          SPACEWAR
          3 File(s)      1,757 bytes
          3 Dir(s)   640K bytes free

C:\>_
```

</section>

<style>
.dos-directory pre {
    margin: 2rem 0;
    white-space: pre;
    font-family: 'DOS', monospace;
    color: var(--dos-yellow);
}
.dos-directory a {
    text-decoration: none;
    color: var(--dos-yellow);
}
.dos-directory a:hover {
    color: var(--dos-green);
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const pre = document.querySelector('.dos-directory pre');
    const text = pre.textContent;
    pre.textContent = '';
    
    let i = 0;
    const typeSpeed = 10; // Adjust typing speed (ms)
    
    function typeChar() {
        if (i < text.length) {
            pre.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, typeSpeed);
        }
    }
    
    typeChar();
});
</script>

