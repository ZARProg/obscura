"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Apa itu Obscura?",
    answer:
      "Obscura adalah platform streaming film dan serial dengan koleksi konten eksklusif dan rekomendasi personal.",
  },
  {
    question: "Bagaimana cara mengelola akun saya?",
    answer:
      "Masuk ke halaman Account melalui menu profil. Di sana Anda bisa mengubah email, kata sandi, atau preferensi tontonan.",
  },
  {
    question: "Apakah saya bisa menonton secara offline?",
    answer:
      "Ya, Anda dapat mengunduh film dan serial tertentu untuk ditonton tanpa koneksi internet di aplikasi mobile.",
  },
  {
    question: "Bagaimana jika saya lupa kata sandi?",
    answer:
      "Klik 'Forgot Password' di halaman login dan ikuti langkah-langkah untuk mengatur ulang kata sandi Anda.",
  },
];

const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-6 md:px-20">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-red-700 mb-6">
          Help Center
        </h1>
        <p className="text-gray-300 mb-8">
          Ada pertanyaan? Cari jawabannya di sini.
        </p>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 rounded-full bg-black border border-black text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          <Search
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-12 space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-black border border-white rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left text-lg font-medium hover:bg-black transition"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {faq.question}
                <ChevronDown
                  className={`transition-transform ${
                    openIndex === idx ? "rotate-180 text-red-700" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-4 text-gray-300 text-sm leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            Tidak ada pertanyaan yang cocok.
          </p>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
