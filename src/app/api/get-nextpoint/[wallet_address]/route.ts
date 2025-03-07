import { db } from "@/db";
import { claimPoints, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ wallet_address: string }> }
) {
    try {
        const { wallet_address } = await params;

        if (!wallet_address) {
            return NextResponse.json({ message: "Wallet address is required" }, { status: 400 });
        }

        // Fetch user ID (it returns an array)
        const userData = await db
            .select()
            .from(users)
            .where(eq(users.walletAddress, wallet_address))
            .execute();

        if (!userData.length) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userData[0].id;

        // Fetch the claim point times for the user
        const timeToClaimPoint = await db
            .select({ startTime: claimPoints.updatedAt, stopTime: claimPoints.nextAt })
            .from(claimPoints)
            .where(eq(claimPoints.userId, userId))
            .execute();

        if (timeToClaimPoint.length === 0) {
            return NextResponse.json({ message: "Claim point times not found" }, { status: 404 });
        }

        const { startTime, stopTime } = timeToClaimPoint[0];

        // Extract only the time component
        if (!startTime || !stopTime) {
            return NextResponse.json({ message: "Invalid claim point times" }, { status: 400 });
        }

        const startTimeOnly = new Date(startTime).toISOString().split('T')[1];
        const stopTimeOnly = new Date(stopTime).toISOString().split('T')[1];

        return NextResponse.json({ startTime: startTimeOnly, stopTime: stopTimeOnly }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}