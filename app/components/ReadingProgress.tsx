"use client";

import { useState, useEffect } from "react";

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(scrollPercent);
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener("scroll", updateProgress);
        updateProgress(); // İlk yüklemede hesapla

        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div
            className="fixed left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-[998] transition-all duration-300"
            style={{ top: isScrolled ? "64px" : "96px" }}
        >
            <div
                className="h-full bg-black dark:bg-zinc-200 transition-[width] duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
