import React from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

import ContactForm from './ContactForm';

const Footer = () => {
    return (
        <footer id="contact" className="relative min-h-screen w-full bg-black text-white flex flex-col pt-32 pb-10 px-6 md:px-20 overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-900 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row flex-1 gap-20">
                {/* Left Col: CTA */}
                <div className="md:w-1/2 flex flex-col justify-center items-start">
                    <h2 className="text-5xl md:text-8xl font-syne font-bold mb-10 leading-tight">
                        Ready to <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Scale?</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-dm text-white/60 mb-12 max-w-md">
                        Let's build something extraordinary together. Reach out for a consultation.
                    </p>
                </div>

                {/* Right Col: Contact Form */}
                <div className="md:w-1/2 flex flex-col justify-center">
                    <ContactForm />
                </div>
            </div>

            {/* Minimal Footer Links */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-10 mt-20">
                <div className="flex flex-col gap-2 mb-6 md:mb-0">
                    <span className="text-2xl font-syne font-bold">AdsCraft</span>
                    <span className="text-sm opacity-50">&copy; 2026 AdsCraft Agency. All Rights Reserved.</span>
                </div>

                <div className="flex gap-8 text-sm font-dm uppercase tracking-wider opacity-70">
                    <a href="#" className="hover:opacity-100 hover:underline">Instagram</a>
                    <a href="#" className="hover:opacity-100 hover:underline">LinkedIn</a>
                    <a href="#" className="hover:opacity-100 hover:underline">Twitter</a>
                    <a href="#" className="hover:opacity-100 hover:underline">Email</a>
                </div>
            </div>
        </footer>
    );
};



export default Footer;
