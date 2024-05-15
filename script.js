function transition() {
    var container = document.getElementById('container');
    var overlay = document.getElementById('transition-overlay');
    var catalog = document.getElementById('product-catalog');

    container.style.opacity = 0;
    container.style.pointerEvents = 'none';

    overlay.style.opacity = 1;
    overlay.style.pointerEvents = 'all';

    document.startViewTransition({
        from: 'container',
        to: 'transition-overlay',
        duration: 500
    });

    setTimeout(function() {
        catalog.style.opacity = 1;
        catalog.style.pointerEvents = 'all';

        document.startViewTransition({
            from: 'transition-overlay',
            to: 'product-catalog',
            duration: 500
        });

        overlay.style.opacity = 0;
        overlay.style.pointerEvents = 'none';
    }, 1000);
}
