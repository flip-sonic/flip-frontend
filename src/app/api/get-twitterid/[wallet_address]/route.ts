import { db } from "@/db";
import { users } from "@/db/schema";
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
        const user = await db
            .select({ twitterId: users.twitterId })
            .from(users)
            .where(eq(users.walletAddress, wallet_address))
            .execute();

        if (!user.length) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ twitterId: user[0].twitterId }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}