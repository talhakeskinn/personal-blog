"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
    postId: string;
    initialViews?: number;
}

export default function ViewCounter({ postId, initialViews = 0 }: ViewCounterProps) {
    const [views, setViews] = useState(initialViews);

    useEffect(() => {
        // LocalStorage: Bu kullanıcı bu yazıyı bu oturumda/tarayıcıda gördü mü?
        const viewedPosts = JSON.parse(localStorage.getItem("viewed_posts") || "[]");

        if (!viewedPosts.includes(postId)) {
            // Eğer görmediyse:
            // 1. API'ye istek atıp artır
            fetch("/api/view", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId }),
            }).catch(console.error);

            // 2. LocalStorage'a ekle (Tekrar saymaması için)
            localStorage.setItem("viewed_posts", JSON.stringify([...viewedPosts, postId]));

            // 3. UI'ı güncelle (Optimistic - Server'dan geleni beklemeye gerek yok, +1 yapabiliriz veya sabit kalabilir)
            // Genelde kullanıcı anlık artışı görmek ister mi? 
            // Views genelde "statik" kalır o an için, ama biz +1 yapalım yaşayan bir his versin.
            setViews((prev) => prev + 1);
        }
    }, [postId]);

    return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400" title={`${views} görüntülenme`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
            >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{views}</span>
        </div>
    );
}
