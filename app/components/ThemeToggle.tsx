"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { useEffect, useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="p-2 transition-transform duration-300 hover:scale-110 text-black dark:text-white"
            aria-label="Toggle Dark Mode"
        >
            <div className="relative w-5 h-5 overflow-hidden">
                <div className={`absolute inset-0 transition-transform duration-500 ${theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}>
                    <IoSunny className="w-5 h-5" />
                </div>
                <div className={`absolute inset-0 transition-transform duration-500 ${theme === "light" ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"}`}>
                    <IoMoon className="w-5 h-5" />
                </div>
            </div>
        </button>
    );
}
