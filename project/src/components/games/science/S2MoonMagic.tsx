import React from 'react';
import { motion } from 'framer-motion';

const S2MoonMagic: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">S2: Moon Magic</h1>
        {/* 1. Warm-Up Quiz */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">🔥 Warm-Up Quiz</h2>
          <div className="bg-blue-50 p-4 rounded">[Quiz UI Placeholder]</div>
        </section>
        {/* 2. Introduction */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">🎬 Introduction</h2>
          <div className="bg-blue-50 p-4 rounded">[Intro Visual/Animation Placeholder]</div>
        </section>
        {/* 3. Myth to Bust */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">❌ Myth to Bust</h2>
          <div className="bg-blue-50 p-4 rounded">[Myth, Truth, 2 Video Players Placeholder]</div>
        </section>
        {/* 4. Hands-On Puzzle */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">🧩 Hands-On Puzzle</h2>
          <div className="bg-blue-50 p-4 rounded">[Puzzle Drag-Drop Placeholder]</div>
        </section>
        {/* 5. Wrap-Up */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">✅ Wrap-Up</h2>
          <div className="bg-blue-50 p-4 rounded">[Teacher Recap Questions Placeholder]</div>
        </section>
        {/* 6. Exit Ticket */}
        <section>
          <h2 className="text-xl font-semibold mb-2">🎫 Exit Ticket</h2>
          <div className="bg-blue-50 p-4 rounded">[Exit Ticket Question Placeholder]</div>
        </section>
      </div>
    </div>
  );
};

export default S2MoonMagic; 