"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { postId } = await req.json();

        if (!postId) {
            return NextResponse.json({ message: "Post ID gerekli" }, { status: 400 });
        }

        const token = process.env.SANITY_API_WRITE_TOKEN;

        if (!token) {
            return NextResponse.json({ message: "API Token bulunamadı" }, { status: 500 });
        }

        // Sanity Mutation: Increment Views
        // setIfMissing ensures it starts at 0 if null
        await writeClient
            .patch(postId)
            .setIfMissing({ views: 0 })
            .inc({ views: 1 })
            .commit();

        return NextResponse.json({ message: "View incremented" });

    } catch (error) {
        console.error("View increment error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
