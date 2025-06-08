import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Menu, X } from 'lucide-react';

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ["Tentang", "Layanan", "Proses", "Testimoni", "Portofolio", "Kontak"];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/50 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#hero" className="text-3xl font-bold text-white tracking-wider">INOVYTE<span className="text-cyan-400">.</span></a>
        <nav className="hidden md:flex space-x-8">
          {navLinks.map(name => (
            <a key={name} href={`#${name.toLowerCase()}`} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">
              {name}
            </a>
          ))}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      <div className={`md:hidden ${isOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden transition-all duration-500 ease-in-out`}>
        <div className="bg-slate-800/95 backdrop-blur-md flex flex-col items-center py-4">
          {navLinks.map(name => (
            <a key={name} href={`#${name.toLowerCase()}`} onClick={() => setIsOpen(false)} className="block py-3 text-lg text-gray-300 hover:text-cyan-400 w-full text-center">
              {name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;