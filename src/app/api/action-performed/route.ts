import { db } from "@/db";
import { actions, users, accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import TwitterApi from "twitter-api-v2";

const BEARER_TOKEN = process.env.NEXT_BEARER_TOKEN!;

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY as string,
  appSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
  accessSecret: process.env.TWITTER_ACCESS_SECRET as string
});

export async function POST(req: Request) {
    try {
        const { wallet_address, actionType } = await req.json();

        if (!wallet_address || !actionType) {
            return NextResponse.json({ message: "Wallet address and action type are required" }, { status: 400 });
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

        if (actionType === "join") {
             // Add action to actions table
            await db.insert(actions).values({ userId, actionType }).execute();

            // Fetch current points
            const currentPoints = await db.select({ points: users.points })
                .from(users)
                .where(eq(users.id, userId))
                .execute();

            const newPoints = (currentPoints[0]?.points ?? 0) + 10;

            // Update user points
            await db.update(users)
                .set({ points: newPoints })
                .where(eq(users.id, userId))
                .execute();

            return NextResponse.json({ message: `${actionType} action performed and points updated` }, { status: 200 });
        }

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

        let twitterResponse;
        if (actionType === "retweet") {
            twitterResponse = await fetch(`https://api.twitter.com/2/tweets/1891841157904072828/retweeted_by`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });
        } else if (actionType === "like") {
            twitterResponse = await client.v2.tweetLikedBy("1891841157904072828", {
                'user.fields': 'created_at'
            });
        } else if (actionType === "follow") {
            twitterResponse = await fetch(`https://api.twitter.com/2/users/1891800745273589761/followers?max_results=50`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });
        } else {
            return NextResponse.json({ message: "Invalid action type" }, { status: 400 });
        }

        if (twitterResponse instanceof Response && !twitterResponse.ok) {
            return NextResponse.json({ message: "Error fetching Twitter data" }, { status: 500 });
        }

        let twitterData;
        if (twitterResponse instanceof Response) {
            twitterData = await twitterResponse.json();
        } else {
            twitterData = twitterResponse;
        }
        const foundUsers = twitterData.data || [];

        const isActionValid = foundUsers.some((user: { id: string }) => user.id === twitterId);

        if (!isActionValid) {
            return NextResponse.json({ message: `User didn't perform ${actionType}` }, { status: 403 });
        }

        // Add action to actions table
        await db.insert(actions).values({ userId, actionType }).execute();

        // Fetch current points
        const currentPoints = await db.select({ points: users.points })
            .from(users)
            .where(eq(users.id, userId))
            .execute();

        const newPoints = (currentPoints[0]?.points ?? 0) + (actionType === "follow" ? 20 : 10);

        // Update user points
        await db.update(users)
            .set({ points: newPoints })
            .where(eq(users.id, userId))
            .execute();

        return NextResponse.json({ message: `${actionType} action performed and points updated` }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
