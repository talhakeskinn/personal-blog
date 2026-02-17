import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { postId, action } = body;

        if (!postId) {
            return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
        }

        if (!process.env.SANITY_API_WRITE_TOKEN) {
            return NextResponse.json({ message: "API Token bulunamadı" }, { status: 500 });
        }



        const likeChange = action === 'unlike' ? -1 : 1;

        // Sanity Mutation
        const data = await writeClient
            .patch(postId)
            .setIfMissing({ likes: 0 })
            .inc({ likes: likeChange })
            .commit();

        // Prevent negative likes
        if (data.likes < 0) {
            await writeClient.patch(postId).set({ likes: 0 }).commit();
        }

        return NextResponse.json({ message: "Success", likes: Math.max(0, data.likes) });
    } catch (error) {
        console.error("Like API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
