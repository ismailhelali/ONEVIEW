function transition() {
    var overlay = document.getElementById('transition-overlay');
    overlay.style.opacity = 1;
    overlay.style.pointerEvents = 'all';
    document.startViewTransition({
        from: 'container',
        to: 'transition-overlay',
        duration: 500
    });
    setTimeout(function() {
        document.startViewTransition({
            from: 'transition-overlay',
            to: 'container',
            duration: 500
        });
        overlay.style.opacity = 0;
        overlay.style.pointerEvents = 'none';
    }, 1000);
}
