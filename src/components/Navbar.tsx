"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CurrencySwitcher from "./CurrencySwitcher";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "The Program", path: "/courses" },
  { name: "Pillars", path: "/pillars" },
  { name: "Gallery", path: "/gallery" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Businesses", path: "/businesses" },
  { name: "Resources", path: "/resources" },
  { name: "Partnerships", path: "/partnerships" },
  { name: "Team", path: "/team" },
  { name: "About", path: "/about" },
];

const desktopMainLinks = [
  { name: "Home", path: "/" },
  { name: "The Program", path: "/courses" },
  { name: "Pillars", path: "/pillars" },
  { name: "Businesses", path: "/businesses" },
  { name: "Resources", path: "/resources" },
  { name: "Partnerships", path: "/partnerships" },
];

const aboutDropdownLinks = [
  { name: "About Us", path: "/about" },
  { name: "Our Team", path: "/team" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Gallery", path: "/gallery" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isDarkHero = pathname === "/" || pathname === "/pillars";
  const navTextClass =
    !scrolled && isDarkHero ? "text-ivory" : "text-foreground";
  const mutedNavTextClass =
    !scrolled && isDarkHero
      ? "text-ivory/80 hover:text-ivory hover:bg-white/10"
      : "text-muted-foreground hover:text-foreground hover:bg-muted";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50 text-foreground"
          : `bg-transparent ${navTextClass}`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex h-12 w-12 items-center gap-2">
            <Image
              src="/logo.png"
              alt="Women of Influence Academy"
              width={48}
              height={48}
              priority
              className="object-contain w-auto h-12"
              style={{ width: "auto" }}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {desktopMainLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-2.5 py-2 rounded-lg text-[11px] xl:text-xs font-body font-medium uppercase tracking-wider transition-colors duration-200 ${
                  pathname === link.path
                    ? scrolled || !isDarkHero
                      ? "text-primary bg-plum/10"
                      : "text-ivory font-bold bg-white/20"
                    : mutedNavTextClass
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dropdown for About & community items */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`px-2.5 py-2 rounded-lg text-[11px] xl:text-xs font-body font-medium uppercase tracking-wider transition-colors duration-200 flex items-center gap-1 cursor-pointer outline-none ${
                  aboutDropdownLinks.some((link) => pathname === link.path)
                    ? scrolled || !isDarkHero
                      ? "text-primary bg-plum/10 font-bold"
                      : "text-ivory font-bold bg-white/20"
                    : mutedNavTextClass
                }`}
              >
                <span>About</span>
                <svg
                  className={`w-2.5 h-2.5 transition-transform duration-250 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 pt-2 w-48 z-50"
                  >
                    <div className="rounded-xl shadow-xl border border-border/50 bg-background/98 backdrop-blur-md overflow-hidden py-1">
                      {aboutDropdownLinks.map((link) => (
                        <Link
                          key={link.path}
                          href={link.path}
                          className={`block px-4 py-2.5 text-xs font-body font-medium uppercase tracking-wider transition-colors duration-200 ${
                            pathname === link.path
                              ? "text-primary bg-plum/10 font-semibold"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-1 xl:ml-2 flex items-center">
              <CurrencySwitcher isDark={!scrolled && isDarkHero} />
            </div>
            <Link
              href="/apply"
              className="btn-gold ml-1 xl:ml-2 text-xs xl:text-sm px-4 xl:px-6 py-2.5 uppercase tracking-wider whitespace-nowrap"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${!scrolled && isDarkHero ? "text-ivory hover:bg-white/10" : "text-foreground hover:bg-muted"}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-md border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-xs font-body font-medium uppercase tracking-wider transition-colors ${
                    pathname === link.path
                      ? "text-primary bg-plum/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex justify-between items-center px-4 py-3 border-t border-border mt-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Currency</span>
                <CurrencySwitcher isDark={false} />
              </div>

              <Link
                href="/apply"
                onClick={() => setIsOpen(false)}
                className="block text-center btn-gold mt-3 text-sm px-6 py-3 uppercase tracking-wider"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
