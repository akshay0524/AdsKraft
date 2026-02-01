import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import local assets
import googleAdsImg from '../assets/googleads.png';
import metaAdsImg from '../assets/metaads.png';
import seoImg from '../assets/SeoAnalytics.png';
import googleBusImg from '../assets/googleBusiness.png';

// Service Data
const services = [
    {
        id: '01',
        title: 'Google Ads',
        desc: 'Capture intent when it matters most.',
        color: 'bg-zinc-950',
        accent: 'text-blue-500',
        img: googleAdsImg
    },
    {
        id: '02',
        title: 'Meta Ads',
        desc: 'Stop the scroll. Create desire.',
        color: 'bg-zinc-950',
        accent: 'text-pink-500',
        img: metaAdsImg
    },
    {
        id: '03',
        title: 'Analytics & SEO',
        desc: 'Organic growth that compounds over time.',
        color: 'bg-zinc-950',
        accent: 'text-green-500',
        img: seoImg
    },
    {
        id: '04',
        title: 'Google Business',
        desc: 'Dominate local search and maps.',
        color: 'bg-zinc-950',
        accent: 'text-indigo-500',
        img: googleBusImg
    },
];

const HorizontalGallery = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const headerRef = useRef(null);
    const cursorFollowerRef = useRef(null);
    const imagesRef = useRef([]);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Horizontal Scroll Logic
            ScrollTrigger.matchMedia({
                "(min-width: 768px)": function () {
                    const pin = gsap.fromTo(
                        sectionRef.current,
                        { translateX: 0 },
                        {
                            translateX: "-300vw", // Move by 3 widths (4 items total)
                            ease: "none",
                            duration: 1,
                            scrollTrigger: {
                                trigger: triggerRef.current,
                                start: "top top",
                                end: "+=3000",
                                scrub: 1,
                                pin: true,
                                anticipatePin: 1
                            },
                        }
                    );
                    return () => pin.kill();
                }
            });

            // Header Entry Animation
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: 1
                    }
                }
            );

            const xTo = gsap.quickTo(cursorFollowerRef.current, "x", { duration: 0.6, ease: "power3.out" });
            const yTo = gsap.quickTo(cursorFollowerRef.current, "y", { duration: 0.6, ease: "power3.out" });

            const handleMouseMove = (e) => {
                xTo(e.clientX);
                yTo(e.clientY);
            };

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };

        }, triggerRef);

        return () => ctx.revert();
    }, []);

    const handleMouseEnter = (index) => {
        // Hide all other images
        imagesRef.current.forEach((img, i) => {
            if (i !== index && img) {
                gsap.to(img, { opacity: 0, scale: 0.8, duration: 0.3, overwrite: true });
            }
        });

        // Show active image
        const targetImg = imagesRef.current[index];
        if (targetImg) {
            gsap.to(targetImg, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)",
                overwrite: true
            });
        }
    };

    const handleMouseLeave = (index) => {
        const targetImg = imagesRef.current[index];
        if (targetImg) {
            gsap.to(targetImg, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        }
    };

    return (
        <section id="work" className="overflow-hidden bg-zinc-950 text-white relative">
            <div ref={triggerRef} className="min-h-screen w-full relative">

                {/* --------------------------------------------- */}
                {/* FLOATING CURSOR FOLLOWER CONTAINER (FIXED)   */}
                {/* --------------------------------------------- */}
                <div
                    ref={cursorFollowerRef}
                    className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-normal hidden md:flex flex-col items-center justify-center" // Hidden on mobile
                    style={{ transform: 'translate(-50%, -50%)', width: '300px', height: '300px' }}
                >
                    {services.map((service, index) => (
                        <div
                            key={index}
                            ref={el => imagesRef.current[index] = el}
                            className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 origin-center will-change-transform"
                        /* Removed bg-zinc-900, shadow, border-radius to float icons freely */
                        >
                            <img
                                src={service.img}
                                alt={service.title}
                                className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            /* Added slight drop-shadow to pop from dark bg */
                            />
                        </div>
                    ))}
                </div>


                {/* Header */}
                <div className="md:absolute md:top-10 md:right-10 w-full p-6 md:p-0 z-40 mix-blend-difference">
                    <h2 ref={headerRef} className="text-xl md:text-2xl font-dm font-medium flex items-center justify-end gap-2 text-white">
                        From here, we scale brands <span className="text-2xl transform rotate-90 md:rotate-0">→</span>
                    </h2>
                </div>

                {/* Track */}
                <div ref={sectionRef} className="flex flex-col md:flex-row w-full md:w-[500vw] h-auto md:h-full">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`w-full md:w-screen h-[60vh] md:h-full flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-white/5 ${service.color} overflow-hidden group`}
                        >
                            {/* Big Background Number */}
                            <div className="absolute opacity-5 text-[30vw] font-syne font-bold select-none z-0">
                                {service.id}
                            </div>

                            {/* Mobile Image (Inline) */}
                            <div className="md:hidden w-full h-[250px] mb-8 relative z-10 flex justify-center items-center">
                                <img
                                    src={service.img}
                                    alt={service.title}
                                    className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                />
                            </div>

                            {/* Content Trigger */}
                            <div
                                className="z-10 text-center max-w-4xl px-4 relative cursor-none"
                            >
                                <h3
                                    className={`text-[12vw] md:text-[8vw] leading-none font-syne font-bold mb-4 md:mb-6 ${service.accent} transition-all duration-300 hover:opacity-100 opacity-90 hover:drop-shadow-[0_0_25px_currentColor]`}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={() => handleMouseLeave(index)}
                                >
                                    {service.title}
                                </h3>
                                <p className="text-xl md:text-4xl font-dm font-light text-white/80 pointer-events-none">
                                    {service.desc}
                                </p>
                            </div>

                            {/* Decorative Line */}
                            <div className="hidden md:block absolute bottom-20 left-0 w-full h-[1px] bg-white/10 z-10" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HorizontalGallery;
