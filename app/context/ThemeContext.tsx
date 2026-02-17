"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // LocalStorage kontrolü
        const storedTheme = localStorage.getItem("theme") as Theme;
        if (storedTheme) {
            setTheme(storedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;
        console.log("Theme changing to:", theme);

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        console.log("Toggling theme from:", theme);
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    // İlk render'da hydration mismatch olmaması için,
    // ThemeProvider children'ı her zaman render etmeli ki
    // alt bileşenlerdeki (Navbar gibi) useTheme hook'u hata vermesin.
    // Provider'ı mounted check arkasına saklamıyoruz.

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
