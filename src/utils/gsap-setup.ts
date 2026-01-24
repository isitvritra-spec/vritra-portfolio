import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Default animation settings
export const defaultConfig = {
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.1,
};

// Initialize GSAP with optimal settings
export function initGSAP() {
    // Set default GSAP config
    gsap.defaults({
        duration: defaultConfig.duration,
        ease: defaultConfig.ease,
    });

    // Configure ScrollTrigger
    ScrollTrigger.config({
        ignoreMobileResize: true,
    });

    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        gsap.globalTimeline.timeScale(10); // Speed up animations significantly
        ScrollTrigger.normalizeScroll(false);
    }
}

// Fade in from bottom animation
export function fadeInUp(element: string | Element, options = {}) {
    return gsap.from(element, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        ...options,
    });
}

// Fade in with stagger
export function staggerFadeIn(elements: string | Element[], options = {}) {
    return gsap.from(elements, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.15,
        ...options,
    });
}

// Scale in animation
export function scaleIn(element: string | Element, options = {}) {
    return gsap.from(element, {
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(1.4)',
        ...options,
    });
}

// Create scroll-triggered animation
export function scrollTriggerAnimation(
    element: string | Element,
    animation: gsap.TweenVars,
    triggerOptions = {}
) {
    return gsap.from(element, {
        ...animation,
        scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
            ...triggerOptions,
        },
    });
}

// Counter animation for numbers
export function animateCounter(element: Element, targetValue: number, duration = 2) {
    const obj = { value: 0 };
    return gsap.to(obj, {
        value: targetValue,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
            element.textContent = Math.round(obj.value).toString();
        },
    });
}

// Magnetic button effect
export function magneticButton(button: HTMLElement, strength = 0.3) {
    button.addEventListener('mouseenter', (e) => {
        gsap.to(button, {
            duration: 0.3,
            scale: 1.05,
            ease: 'power2.out',
        });
    });

    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
            duration: 0.3,
            x: x * strength,
            y: y * strength,
            ease: 'power2.out',
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            duration: 0.5,
            x: 0,
            y: 0,
            scale: 1,
            ease: 'elastic.out(1, 0.5)',
        });
    });
}

// 3D Tilt effect for cards
export function tiltCard(card: HTMLElement, maxTilt = 10) {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            scale: 1.02,
            ease: 'power2.out',
        });
    });

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        gsap.to(card, {
            duration: 0.3,
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: 'power2.out',
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.5,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            ease: 'power2.out',
        });
    });
}

export default { initGSAP, fadeInUp, staggerFadeIn, scaleIn, scrollTriggerAnimation, animateCounter, magneticButton, tiltCard };
