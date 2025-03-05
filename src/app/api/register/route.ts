import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { wallet_address, twitterId, twitterName } = await req.json();

        if (!wallet_address || !twitterId || !twitterName) {
            return NextResponse.json({ message: "Wallet address and Twitter info are required" }, { status: 400 });
        }

        // Check if the Twitter ID already exists
        const existingUser = await db.select().from(users).where(eq(users.twitterId, twitterId)).limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json({ message: "Already signed in" }, { status: 409 });
        }

        // Update the user where wallet address matches
        const updated = await db
            .update(users)
            .set({ twitterId, twitterName })
            .where(eq(users.walletAddress, wallet_address))
            .returning();
        
        if (updated.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "You can earn points now" }, { status: 201 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}