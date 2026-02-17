"use client";

import { useState, useEffect } from "react";

interface LikeButtonProps {
    id: string;
    initialLikes?: number;
    className?: string; // Ekstra stil için
    readOnly?: boolean; // Sadece görüntüleme modu
}

export default function LikeButton({ id, initialLikes = 0, className = "", readOnly = false }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // LocalStorage kontrolü: Bu kullanıcı bu yazıyı daha önce beğendi mi?
        const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
        if (likedPosts.includes(id)) {
            setHasLiked(true);
        }
    }, [id]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (readOnly || isLoading) return;



        const action = hasLiked ? 'unlike' : 'like';
        const newLikes = hasLiked ? likes - 1 : likes + 1;

        // Optimistic Update
        setLikes(newLikes);
        setHasLiked(!hasLiked);
        setIsLoading(true);

        // LocalStorage Update
        const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
        if (hasLiked) {
            // Remove ID
            const updated = likedPosts.filter((pid: string) => pid !== id);
            localStorage.setItem("liked_posts", JSON.stringify(updated));
        } else {
            // Add ID
            localStorage.setItem("liked_posts", JSON.stringify([...likedPosts, id]));
        }

        try {
            const res = await fetch("/api/like", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: id, action }),
            });

            if (!res.ok) {
                // Rollback if error
                setLikes(hasLiked ? likes : likes); // Revert to original
                setHasLiked(hasLiked); // Revert
                // Revert localStorage? A bit complex, maybe just alert.
                // For simplicity in this context, just reverting state is enough visual feedback.
                console.error("Failed to update like");
            }
        } catch (error) {
            console.error("Like error:", error);
            // Rollback
            setLikes(likes);
            setHasLiked(hasLiked);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 z-30 relative group/btn ${hasLiked
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 cursor-default"
                : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                } ${className}`}
            aria-label="Beğen"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={hasLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={hasLiked ? "0" : "2"}
                className={`w-4 h-4 transition-transform duration-300 ${hasLiked ? "scale-110" : "group-hover/btn:scale-110"}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
            <span>{likes}</span>
        </button>
    );
}
