import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const servicesList = [
    { title: "Paid Social", details: "Meta, TikTok, Pinterest. Data-driven creative strategies that stop the scroll." },
    { title: "Paid Search", details: "Google, Bing. High intent capture with precise targeting." },
    { title: "SEO & Content", details: "Long term organic growth and authority building through technical excellence." },
    { title: "Creative Strategy", details: "Ad creatives that convert. We merge data with high-end aesthetics." }
];

const reviews = [
    { text: "AdsCraft scaled our revenue by 300% .The strategy was flawless.", author: "Sarah Jenkins" },
    { text: "The cinematic approach to performance marketing is unlike anything else in the industry.", author: "Marcus Thorne" },
    { text: "Professional, fast, and incredibly effective. Our ROAS doubled.", author: "Ajay Thomas" }
];

const AccordionItem = ({ title, details, isOpen, onClick, index }) => {
    return (
        <div
            className="border-b border-white/20 py-8 cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex justify-between items-center">
                <span className="text-sm font-dm opacity-50 mr-4">0{index + 1}</span>
                <h3 className="flex-1 text-3xl md:text-5xl font-syne font-medium group-hover:pl-4 transition-all duration-300 text-white group-hover:text-gray-300">
                    {title}
                </h3>
                <span className={`text-3xl transition-transform duration-500 font-light ${isOpen ? 'rotate-45' : 'rotate-0'}`}>+</span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 20 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="text-xl font-dm text-white/60 max-w-2xl pl-10 leading-relaxed">{details}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Services = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="services" className="min-h-screen w-full bg-zinc-950 text-white py-20 px-6 md:px-20 flex flex-col md:flex-row gap-20">

            {/* Left: Services Accordion */}
            <div className="w-full md:w-1/2">
                <h2 className="text-sm font-dm uppercase tracking-widest opacity-50 mb-10">Our Expertise</h2>
                <div className="flex flex-col">
                    {servicesList.map((service, index) => (
                        <AccordionItem
                            key={index}
                            index={index}
                            title={service.title}
                            details={service.details}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(index === openIndex ? null : index)}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Reviews */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h2 className="text-sm font-dm uppercase tracking-widest opacity-50 mb-10">Client Stories</h2>
                <div className="space-y-12">
                    {reviews.map((review, i) => (
                        <div key={i} className="group">
                            <p className="text-2xl md:text-3xl font-syne font-light leading-snug mb-6 group-hover:text-white/80 transition-colors">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/10" />
                                <span className="font-dm text-sm opacity-60">{review.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Services;
