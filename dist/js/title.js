document.addEventListener('DOMContentLoaded', function() {
    const pageTitle = document.body.getAttribute('data-page-title');
    if (pageTitle) {
        const titleBar = document.querySelector('body:before');
        if (titleBar) {
            const computedStyle = window.getComputedStyle(titleBar, ':before');
            const currentContent = computedStyle.getPropertyValue('content');
            titleBar.style.setProperty('--title-content', currentContent + pageTitle);
        }
    }
}); 