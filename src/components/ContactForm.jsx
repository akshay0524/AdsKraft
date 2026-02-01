import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactForm = () => {
    // ---------------------------------------------------------------------------
    // CONFIGURATION
    // ---------------------------------------------------------------------------
    const RECIPIENT_EMAIL = "akshay246908@gmail.com"; // User: REPLACE THIS WITH YOUR EMAIL
    // ---------------------------------------------------------------------------

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

    const validate = (field, value) => {
        let error = '';
        const trimmedValue = value.trim();
        switch (field) {
            case 'name':
                if (!trimmedValue) error = 'Name is required.';
                else if (trimmedValue.length < 2) error = 'Name must be at least 2 characters.';
                break;
            case 'email':
                if (!trimmedValue) error = 'Email is required.';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) error = 'Invalid email address.';
                break;
            case 'message':
                if (!trimmedValue) error = 'Message is required.';
                else if (trimmedValue.length < 10) error = 'Message must be at least 10 characters.';
                break;
            default: break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = validate(name, value);
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: error }));
        if (status !== 'idle') setStatus('idle');
    };

    const isFormValid = () => {
        return !validate('name', formData.name) &&
            !validate('email', formData.email) &&
            !validate('message', formData.message) &&
            formData.name && formData.email && formData.message;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setStatus('loading');

        setTimeout(() => {
            // Construct Gmail URL
            const subject = encodeURIComponent(`New Inquiry from ${formData.name}`);
            const body = encodeURIComponent(
                `Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}`
            );

            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${subject}&body=${body}`;

            // Open in new tab
            window.open(gmailLink, '_blank');

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });

            // Revert status after 5s
            setTimeout(() => setStatus('idle'), 5000);
        }, 1500);
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6 md:p-10 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-3xl font-display font-medium text-white mb-2">Let's talk.</h3>
            <p className="text-white/60 mb-8 font-dm">Fill out the form below and we'll start scaling your brand.</p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-dm text-white/80 block">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-black/40 border ${errors.name ? 'border-red-500' : 'border-white/10 focus:border-white/40'} rounded-lg px-4 py-3 text-white outline-none transition-colors font-dm`}
                        placeholder="Your Name"
                    />
                    <AnimatePresence>
                        {errors.name && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 text-xs font-dm block">{errors.name}</motion.span>}
                    </AnimatePresence>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-dm text-white/80 block">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-black/40 border ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-white/40'} rounded-lg px-4 py-3 text-white outline-none transition-colors font-dm`}
                        placeholder="name@example.com"
                    />
                    <AnimatePresence>
                        {errors.email && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 text-xs font-dm block">{errors.email}</motion.span>}
                    </AnimatePresence>
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-dm text-white/80 block">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full bg-black/40 border ${errors.message ? 'border-red-500' : 'border-white/10 focus:border-white/40'} rounded-lg px-4 py-3 text-white outline-none transition-colors font-dm resize-none`}
                        placeholder="Tell us about your project..."
                    />
                    <AnimatePresence>
                        {errors.message && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 text-xs font-dm block">{errors.message}</motion.span>}
                    </AnimatePresence>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                    {status === 'success' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-sm font-dm">
                            Redirecting to your email client...
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === 'loading' || !isFormValid()}
                    className={`w-full py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 font-syne
                        ${status === 'loading' || !isFormValid()
                            ? 'bg-zinc-800 text-white/30 cursor-not-allowed'
                            : 'bg-white text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                        }
                    `}
                >
                    {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                            Opening Gmail...
                        </span>
                    ) : 'Continue to Email'}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
