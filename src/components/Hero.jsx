import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const HolographicLogo = ({ imageRef }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for mouse movement
    const mouseX = useSpring(x, { stiffness: 50, damping: 15, mass: 0.5 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 15, mass: 0.5 });

    // Map mouse position to 3D Rotation (Tilt)
    const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
    const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

    // Dynamic Glare Position (moves opposite to tilt)
    const glareX = useTransform(mouseX, [-300, 300], [0, 100]);
    const glareY = useTransform(mouseY, [-300, 300], [0, 100]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            className="w-full h-full flex items-center justify-center p-10 cursor-none perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Floating Animation Wrapper */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-full h-full flex items-center justify-center"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Back Glow (Ambient) */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-indigo-600/30 blur-[100px] rounded-full pointer-events-none"
                    />

                    {/* The Logo Image */}
                    <img
                        ref={imageRef}
                        src="/hero.png"
                        alt="Brand Logo"
                        className="w-full h-full object-contain object-center relative z-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                        style={{ transform: "translateZ(50px)" }} // Pop out 3D
                    />

                    {/* Holographic Glare Overlay */}
                    <motion.div
                        className="absolute inset-0 z-20 pointer-events-none opacity-50 mix-blend-overlay"
                        style={{
                            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8), transparent 50%)`
                        }}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const Hero = () => {
    const containerRef = useRef(null);
    const imageRef = useRef(null); // Passed down to HolographicLogo
    const lettersRef = useRef([]);

    const word = "AdsCraft";

    useLayoutEffect(() => {
        const letters = lettersRef.current;
        let ctx = gsap.context(() => {
            // Initial Load Animation
            const loadTimeline = gsap.timeline();

            loadTimeline
                .fromTo(letters,
                    { y: 100, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.5,
                        stagger: 0.05,
                        ease: "power4.out"
                    }
                )
                // Animate the logo entrance via the ref passed to the img
                .fromTo(imageRef.current,
                    { scale: 0.8, opacity: 0, rotateY: 90 },
                    { scale: 1, opacity: 1, rotateY: 0, duration: 2, ease: "power3.out" },
                    "-=1.5"
                );

            // Scroll Animation (Vanish: Last letter -> First letter)
            const scrollTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom 30%",
                    scrub: 1,
                }
            });

            const reversedLetters = [...letters].reverse();

            scrollTimeline.to(reversedLetters, {
                y: 300,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.in",
            });

        }, containerRef); // Scope to container

        return () => ctx.revert();
    }, []);

    const handleMouseEnter = (index) => {
        // Ramp up distortion
        gsap.to(`#displacement-${index}`, {
            attr: { scale: 50 },
            duration: 0.8,
            ease: "power3.out"
        });
        gsap.to(`#turbulence-${index}`, {
            attr: { baseFrequency: '0.02 0.15' },
            duration: 0.8,
            ease: "power3.out"
        });
    };

    const handleMouseLeave = (index) => {
        // Ramp down distortion
        gsap.to(`#displacement-${index}`, {
            attr: { scale: 0 },
            duration: 0.8,
            ease: "power3.out"
        });
        gsap.to(`#turbulence-${index}`, {
            attr: { baseFrequency: '0.0 0.0' },
            duration: 0.8,
            ease: "power3.out"
        });
    };

    return (
        <section id="home" ref={containerRef} className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden">

            {/* SVG Filters Definition (Hidden but Functional) */}
            <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
                <defs>
                    {word.split('').map((_, i) => (
                        <filter key={i} id={`warp-${i}`}>
                            <feTurbulence
                                id={`turbulence-${i}`}
                                type="turbulence"
                                baseFrequency="0.0 0.0"
                                numOctaves="2"
                                result="turbulence"
                            />
                            <feDisplacementMap
                                id={`displacement-${i}`}
                                in="SourceGraphic"
                                in2="turbulence"
                                scale="0"
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>
                    ))}
                </defs>
            </svg>

            {/* Subtle Ambient Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Left: Interactive Holographic 3D Logo */}
            <div className="w-full md:w-[35%] h-[40vh] md:h-screen relative z-30 mt-20 md:mt-0">
                <HolographicLogo imageRef={imageRef} />
            </div>

            {/* Right: Typography (65% width) */}
            <div className="w-full md:w-[65%] h-auto md:h-screen flex flex-col justify-center items-center md:items-start p-6 md:p-24 relative z-20 pb-20 md:pb-0">
                {/* Glow Container */}
                <div className="absolute top-1/2 left-1/2 md:left-24 -translate-y-1/2 -translate-x-1/2 md:translate-x-0 w-[40vw] h-[20vw] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                <h1 className="font-display font-bold leading-none flex items-baseline tracking-tighter uppercase relative z-10">
                    {word.split('').map((char, index) => {
                        return (
                            <span
                                key={index}
                                ref={el => lettersRef.current[index] = el}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={() => handleMouseLeave(index)}
                                className="inline-block origin-bottom will-change-transform cursor-pointer hover:text-white transition-colors drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                style={{
                                    fontSize: index === 0
                                        ? 'clamp(6rem, 20vw, 20rem)' // Huge A
                                        : 'clamp(2rem, 6vw, 6rem)',  // Uniform small size
                                    filter: `url(#warp-${index}) drop-shadow(0 0 20px rgba(255,255,255,0.3))` // Combined filters
                                }}
                            >
                                {char}
                            </span>
                        );
                    })}
                </h1>

                <div className="mt-12 md:ml-4 max-w-lg opacity-80 mix-blend-plus-lighter">
                    <h2 className="text-xl md:text-2xl font-dm font-light mb-8 leading-relaxed text-gray-300">
                        We craft digital experiences that scale. <br />
                        <span className="text-white font-medium">Performance meets Design.</span>
                    </h2>
                    <button className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Let's Scale Your Brand
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
