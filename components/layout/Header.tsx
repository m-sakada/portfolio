'use client';

import { useState } from 'react';
import { NavLink } from '@/components/ui/Link';

interface HeaderProps {
  showAbout?: boolean;
  nameEn?: string;
}

export default function Header({ showAbout = true, nameEn }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const siteTitle = nameEn ? `${nameEn}'s Portfolio` : 'Portfolio';

  return (
    <header className="sticky top-0 z-1000 bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-gray-800/90 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            href="/" 
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 tracking-[.1em]"
            onClick={closeMenu}
          >
            {siteTitle}
          </NavLink>

          {showAbout && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <NavLink href="/" className="font-bold tracking-[.1em]">
                  TOP
                </NavLink>
                <NavLink href="/about" className="font-bold tracking-[.1em]">
                  About
                </NavLink>
              </nav>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {showAbout && isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <NavLink href="/" className="font-bold px-2 py-1 tracking-[.1em]" onClick={closeMenu}>
                TOP
              </NavLink>
              <NavLink href="/about" className="font-bold px-2 py-1 tracking-[.1em]" onClick={closeMenu}>
                About
              </NavLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
