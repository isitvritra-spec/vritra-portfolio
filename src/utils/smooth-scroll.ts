import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        return; // Don't apply smooth scroll if user prefers reduced motion
    }

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    function raf(time: number) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return lenis;
}

export function scrollTo(target: string | number, options = {}) {
    if (lenis) {
        lenis.scrollTo(target, {
            offset: 0,
            duration: 1.5,
            ...options,
        });
    }
}

export function getLenis() {
    return lenis;
}

export default { initSmoothScroll, scrollTo, getLenis };
