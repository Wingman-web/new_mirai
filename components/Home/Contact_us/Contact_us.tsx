'use client';

import { memo } from 'react';
import Image from 'next/image';

const DAY_VIEW_PATH = '/images/day_view.png';

const ContactForm = memo(function ContactForm() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <Image
        src={DAY_VIEW_PATH}
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Glassmorphism Card */}
        <div
          className="rounded-2xl p-10 md:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Title */}
          <h2
            className="text-2xl md:text-3xl tracking-[0.3em] mb-10"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: '#1a2a3a',
              fontWeight: 400,
            }}
          >
            CONTACT US
          </h2>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Name Input */}
            <div className="border-b border-gray-300">
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-transparent py-4 outline-none placeholder-opacity-100"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#722F37',
                  fontSize: '1rem',
                }}
              />
              <style jsx>{`
                input::placeholder {
                  color: #722F37;
                  opacity: 1;
                  font-family: Georgia, "Times New Roman", serif;
                }
              `}</style>
            </div>

            {/* Email Input */}
            <div className="border-b border-gray-300">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent py-4 outline-none"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#722F37',
                  fontSize: '1rem',
                }}
              />
            </div>

            {/* Number Input */}
            <div className="border-b border-gray-300">
              <input
                type="tel"
                placeholder="Number"
                className="w-full bg-transparent py-4 outline-none"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#722F37',
                  fontSize: '1rem',
                }}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 border-2 border-gray-400 rounded-sm accent-[#722F37] cursor-pointer"
                style={{
                  accentColor: '#722F37',
                }}
              />
              <label
                htmlFor="terms"
                className="cursor-pointer"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#1a2a3a',
                  fontSize: '0.95rem',
                }}
              >
                I accept the terms and conditions
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-5 rounded-xl mt-6 transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: '#722F37',
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: '#ffffff',
                fontSize: '1rem',
                letterSpacing: '0.15em',
              }}
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;
