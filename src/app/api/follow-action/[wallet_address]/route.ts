import { db } from "@/db";
import { actions, users, accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

const BEARER_TOKEN = process.env.NEXT_BEARER_TOKEN!;

export async function POST(req: Request, { params }: { params: { wallet_address: string } }) {
    try {
        const { wallet_address } = await params;

        if (!wallet_address) {
            return NextResponse.json({ message: "Wallet address is required" }, { status: 400 });
        }

        // Fetch user ID from the users table
        const user = await db.select({ id: users.id })
            .from(users)
            .where(eq(users.walletAddress, wallet_address))
            .execute();

        if (!user.length) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { id: userId } = user[0];

        // Fetch user's Twitter ID (providerAccountId) from the accounts table
        const twitterAccount = await db.select({ twitterId: accounts.providerAccountId })
            .from(accounts)
            .where(and(eq(accounts.userId, userId), eq(accounts.provider, "twitter")))
            .execute();

        if (!twitterAccount.length) {
            return NextResponse.json({ message: "Twitter account not linked" }, { status: 404 });
        }

        const { twitterId } = twitterAccount[0];

        await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));

        const twitterResponse = await fetch(`https://api.twitter.com/2/users/1891800745273589761/followers?max_results=50`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        if (!twitterResponse.ok) {
            return NextResponse.json({ message: "Error fetching Twitter followers" }, { status: 500 });
        }

        const twitterData = await twitterResponse.json();
        const followers = twitterData.data || [];

        
        const isFollowed = followers.some((follower: { id: string }) => follower.id === twitterId);

        if (!isFollowed) {
            return NextResponse.json({ message: "User is not a follower" }, { status: 403 });
        }

        // Add action "follow" to actions table
        await db.insert(actions).values({ userId, actionType: "follow" }).execute();

        // Fetch current points
        const currentPoints = await db.select({ points: users.points })
            .from(users)
            .where(eq(users.id, userId))
            .execute();

        const newPoints = (currentPoints[0]?.points ?? 0) + 20;

        // Update user points (+20)
        await db.update(users)
            .set({ points: newPoints })
            .where(eq(users.id, userId))
            .execute();

        return NextResponse.json({ message: "Followed and points updated" }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
