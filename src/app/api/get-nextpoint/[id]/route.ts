import { db } from "@/db";
import { claimPoints } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: "User need to connect Wallet" }, { status: 400 });
        }

        // Fetch the claim point times for the user
        const timeToClaimPoint = await db
            .select({ startTime: claimPoints.updatedAt, stopTime: claimPoints.nextAt })
            .from(claimPoints)
            .where(eq(claimPoints.userId, id))
            .execute();

        if (timeToClaimPoint.length === 0) {
            return NextResponse.json({ message: "Claim point times not found" }, { status: 404 });
        }

        const { startTime, stopTime } = timeToClaimPoint[0];

        // Extract only the time component
        if (!startTime || !stopTime) {
            return NextResponse.json({ message: "Invalid claim point times" }, { status: 400 });
        }

        return NextResponse.json({ startTime, stopTime }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}