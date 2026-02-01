import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Cursor = () => {
    const cursorRef = useRef(null);
    const xTo = useRef(null);
    const yTo = useRef(null);

    useEffect(() => {
        // Optimization: Don't run cursor logic on touch devices
        if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;

        const cursor = cursorRef.current;

        // Setup simple GSAP quickTo for high performance
        xTo.current = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3", overwrite: "auto" });
        yTo.current = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3", overwrite: "auto" });

        // Center offset
        const moveMouse = (e) => {
            xTo.current(e.clientX - 8);
            yTo.current(e.clientY - 8);
        };

        const handleMouseOver = (e) => {
            // Check for interactive elements
            const isInteractive = e.target.tagName === 'A' ||
                e.target.tagName === 'BUTTON' ||
                e.target.closest('a') ||
                e.target.closest('button');

            if (isInteractive) {
                gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: 'back.out(1.7)' });
            } else {
                gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' });
            }
        };

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="hidden md:block fixed top-0 left-0 w-4 h-4 bg-white mix-blend-difference rounded-full pointer-events-none z-[9999]"
            style={{ willChange: 'transform' }}
        />
    );
};

export default Cursor;
