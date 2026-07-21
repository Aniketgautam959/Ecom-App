"use client";

import Link from "next/link";
import { Github, Instagram, Youtube } from "lucide-react";
import { useEffect, useState } from "react";

interface FooterMenu {
  id: number;
  label: string;
  url: string;
}

export default function EcomFooter() {
  const [footerMenus, setFooterMenus] = useState<FooterMenu[]>([]);

  useEffect(() => {
    fetch("/api/menus/footer")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => setFooterMenus(json.data ?? []))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">E</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Ecommerce</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
              DevCut is a YouTube channel for practical project-based learning.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">SUPPORT</h4>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">FAQ</Link></li>
              <li><Link href="/terms-conditions" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms of use</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Quick Links (from admin menus) */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">QUICK LINKS</h4>
            <ul className="space-y-3">
              {footerMenus.length > 0 ? (
                footerMenus.map((menu) => (
                  <li key={menu.id}>
                    <Link href={menu.url} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {menu.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About us</Link></li>
                  <li><Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Shop + Payments */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">SHOP</h4>
            <ul className="space-y-3 mb-8">
              <li><Link href="/account" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">My Account</Link></li>
              <li><Link href="/checkout" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Checkout</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cart</Link></li>
            </ul>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">ACCEPTED PAYMENTS</h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                <div className="w-5 h-5 rounded-full bg-orange-400 opacity-90 -ml-2" />
              </div>
              <div className="border border-gray-300 rounded px-2 py-0.5">
                <span className="text-xs font-bold text-blue-600">AMEX</span>
              </div>
              <div className="border border-gray-300 rounded px-2 py-0.5">
                <span className="text-xs font-bold text-blue-800">VISA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 dark:border-gray-800 border-gray-100 py-4">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          © 2023 DevCut. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
