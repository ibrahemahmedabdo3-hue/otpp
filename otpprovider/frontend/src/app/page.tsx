import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <nav className="p-6 flex justify-between items-center bg-slate-800 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">OTP Provider</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 hover:text-blue-300">Login</button>
          <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500">Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-6"
      >
        <h2 className="text-5xl font-extrabold mb-4">Secure Verification API</h2>
        <p className="text-slate-400 text-lg mb-8">Fast, Reliable, and Scalable OTP services.</p>
        <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform">Get Started</button>
      </motion.div>

      {/* Ticker */}
      <div className="bg-blue-900 py-2 overflow-hidden border-y border-blue-800">
        <motion.div 
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="whitespace-nowrap font-mono text-sm"
        >
          ● WhatsApp API ● SMS Verification ● Email Tokens ● 99.9% Uptime ● Global Coverage
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 p-8 border-t border-slate-800 text-center text-slate-500">
        <p>Contact Us: +62 (Indonesian Support)</p>
      </footer>
    </div>
  );
}
