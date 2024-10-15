"use client"

import { useState } from 'react';
import { Menu } from 'lucide-react'

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="fixed top-0 w-full py-6 z-[49] bg-miaf-blue-300 px-16 md:px-20 flex justify-between items-center shadow-sm lg:px-32 xl:px-48 2xl:px-56">

            {/* Logo */}
            <a href="/" className="text-white text-lg font-bold">
                <img src="/logo.png" alt="Logo MIAF Asesores" className="h-12 md:h-11" />
            </a>

            {/* Nav */}
            <div className="hidden md:flex space-x-8">
                <a href="/empresas" className="text-white text-base transition-all duration-200 hover:text-miaf-gold-100">
                    Empresas
                </a>
                <a href="/personasFisicas" className="text-white text-base transition-all duration-200 hover:text-miaf-gold-100">
                    Personas físicas
                </a>
                <a href="/internacional" className="text-white text-base transition-all duration-200 hover:text-miaf-gold-100">
                    Internacional
                </a>
            </div>

            {/* Hamburger Icon */}
            <button onClick={handleOpenClick} className="md:hidden text-white focus:outline-none">
                <Menu />
            </button>

            {/* Mobile menu */}
            {isOpen && (
                <div className="absolute top-24 left-0 w-full bg-miaf-blue-200 flex flex-col px-12 space-y-4 py-6 md:hidden">
                    <a href="/empresas" className="text-white">
                        Empresas
                    </a>
                    <a href="/personasFisicas" className="text-white">
                        Personas físicas
                    </a>
                    <a href="/internacional" className="text-white">
                        Internacional
                    </a>
                </div>
            )}
        </nav>
    );
};
