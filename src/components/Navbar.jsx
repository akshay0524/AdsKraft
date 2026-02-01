import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';

const Navbar = ({ lenis }) => {
    const [hidden, setHidden] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    // Scroll Spy Logic
    useEffect(() => {
        const handleSpy = () => {
            const sections = document.querySelectorAll('section, footer');
            let current = 'home';

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 250) { // Increased offset for better accuracy
                    current = section.getAttribute('id');
                }
            });
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleSpy);
        // Run once on mount to set initial state
        handleSpy();

        return () => window.removeEventListener('scroll', handleSpy);
    }, []);

    // Force Scroll to Top on Refresh
    useEffect(() => {
        // Clear hash from URL without reload
        if (window.location.hash) {
            window.history.replaceState(null, '', ' ');
        }

        // Force scroll to top
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
        window.scrollTo(0, 0);
        setActiveSection('home');
    }, [lenis]);

    const navLinks = [
        { name: "Services", href: "#services" },
        { name: "Work", href: "#work" },
        { name: "Agency", href: "#home" },
    ];

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const handleScroll = (e, href) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const targetId = href.replace('#', '');
        setActiveSection(targetId); // Instant active state for UX

        if (lenis) {
            lenis.scrollTo(href, { duration: 1.5 });
        } else {
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-110%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-12 pointer-events-none"
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
                    {/* Logo */}
                    <a
                        href="#home"
                        onClick={(e) => handleScroll(e, '#home')}
                        className="text-3xl md:text-4xl font-display font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-[101] hover:opacity-80 transition-opacity uppercase"
                    >
                        AdsCraft
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl">
                        {navLinks.map((link, index) => (
                            <NavLink
                                key={index}
                                href={link.href}
                                isActive={activeSection === link.href.replace('#', '')}
                                onClick={(e) => handleScroll(e, link.href)}
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <MagneticButton>
                            <a
                                href="#contact"
                                onClick={(e) => handleScroll(e, '#contact')}
                                className="inline-block bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform duration-300"
                            >
                                Let's Talk
                            </a>
                        </MagneticButton>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white font-bold text-sm z-[101] uppercase tracking-widest"
                    >
                        {mobileMenuOpen ? "Close" : "Menu"}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 bg-black z-[90] flex flex-col justify-center items-center gap-8 md:hidden"
                    >
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                className={`text-4xl font-display font-bold hover:text-gray-400 transition-colors uppercase ${activeSection === link.href.replace('#', '') ? 'text-white' : 'text-zinc-500'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={(e) => handleScroll(e, '#contact')}
                            className="mt-8 text-xl font-dm bg-white text-black px-8 py-4 rounded-full"
                        >
                            Let's Talk
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const NavLink = ({ href, children, onClick, isActive }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={href}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative text-sm font-dm transition-colors duration-300 px-2 py-1 ${isActive ? 'text-white font-medium' : 'text-white/60 hover:text-white'
                }`}
        >
            {children}
            {(isHovered || isActive) && (
                <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-[1px] bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            )}
        </a>
    );
};

export default Navbar;
