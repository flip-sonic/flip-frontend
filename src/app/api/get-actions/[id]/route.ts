import { db } from "@/db"; 
import { actions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json({ message: "You need to connect your wallet" }, { status: 400 });
        }

        // Fetch user actions
        const activity = await db.select().from(actions).where(eq(actions.userId, id)).execute();
        
        return NextResponse.json({ activity }, { status: 200 });

    } catch (error) {
        console.error("Error fetching actions:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}