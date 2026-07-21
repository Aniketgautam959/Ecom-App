"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Join Our Newsletter</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We love to surprise our subscribers with occasional gifts.
            </p>
          </div>

          {/* Right — form */}
          {submitted ? (
            <p className="text-sm font-medium text-gray-700">
              Thank you for subscribing! 🎉
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-0 w-full md:w-auto">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 outline-none w-full md:w-72 focus:border-gray-500 dark:focus:border-gray-500"
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
