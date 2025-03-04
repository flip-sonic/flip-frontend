import { db } from "@/db";
import { actions, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import TwitterApi, { ApiResponseError } from "twitter-api-v2";

// Environment variables
// const BEARER_TOKEN = process.env.NEXT_BEARER_TOKEN!;
const TWEET_ID = process.env.NEXT_TWITTER_TWEET_ID!;
const TWITTER_USER_ID = process.env.NEXT_TWITTER_USER_ID!;

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY as string,
  appSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
  accessSecret: process.env.TWITTER_ACCESS_SECRET as string,
});

const ACTION_TYPES = {
  JOIN: "join",
  RETWEET: "retweet",
  LIKE: "like",
  FOLLOW: "follow",
};

export async function POST(req: Request) {
  try {
    const { wallet_address, actionType } = await req.json();

    if (!wallet_address || !actionType) {
      return NextResponse.json(
        { message: "Wallet address and action type are required" },
        { status: 400 }
      );
    }

    // Fetch user ID and Twitter ID from the users table
    const user = await db
      .select({ id: users.id, twitterId: users.twitterId })
      .from(users)
      .where(eq(users.walletAddress, wallet_address))
      .execute();

    if (!user.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { id: userId, twitterId } = user[0];

    // Check if the action has already been performed
    const existingAction = await db
      .select()
      .from(actions)
      .where(and(eq(actions.userId, userId), eq(actions.actionType, actionType)))
      .execute();

    if (existingAction.length > 0) {
      return NextResponse.json(
        { message: `Action '${actionType}' has already been performed` },
        { status: 400 }
      );
    }

    // Handle actions
    if (actionType === ACTION_TYPES.JOIN) {
      await db.transaction(async (tx) => {
        await tx.insert(actions).values({ userId, actionType }).execute();

        const currentPoints = await tx
          .select({ points: users.points })
          .from(users)
          .where(eq(users.id, userId))
          .execute();

        const newPoints = (currentPoints[0]?.points ?? 0) + 10;

        await tx
          .update(users)
          .set({ points: newPoints })
          .where(eq(users.id, userId))
          .execute();
      });

      return NextResponse.json(
        { message: `${actionType} action performed and points updated` },
        { status: 200 }
      );
    }

    if (!twitterId) {
      return NextResponse.json(
        { message: "Twitter account not linked" },
        { status: 404 }
      );
    }

    let twitterResponse;

    switch (actionType) {
      case ACTION_TYPES.RETWEET:
        twitterResponse = await client.v2.tweetRetweetedBy(TWEET_ID);
        break;
      case ACTION_TYPES.LIKE:
        twitterResponse = await client.v2.tweetLikedBy(TWEET_ID, {
          "user.fields": "created_at",
        });
        break;
      case ACTION_TYPES.FOLLOW:
        twitterResponse = await client.v2.followers(TWITTER_USER_ID, {
          max_results: 50,
        });
        break;
      default:
        return NextResponse.json(
          { message: "Invalid action type" },
          { status: 400 }
        );
    }

    const foundUsers = twitterResponse.data || [];
    const isActionValid = foundUsers.some(
      (user: { id: string }) => user.id === twitterId
    );

    if (!isActionValid) {
      return NextResponse.json(
        { message: `User didn't perform ${actionType}` },
        { status: 403 }
      );
    }

    // Use a transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // Add action to actions table
      await tx.insert(actions).values({ userId, actionType }).execute();

      const currentPoints = await tx
        .select({ points: users.points })
        .from(users)
        .where(eq(users.id, userId))
        .execute();

      const newPoints =
        (currentPoints[0]?.points ?? 0) + (actionType === ACTION_TYPES.FOLLOW ? 20 : 10);

      // Update user points
      await tx
        .update(users)
        .set({ points: newPoints })
        .where(eq(users.id, userId))
        .execute();
    });

    return NextResponse.json(
      { message: `${actionType} action performed and points updated` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof ApiResponseError) {
      return NextResponse.json(
        { message: `Twitter API error: ${error.message}` },
        { status: 500 }
      );
    }

    // Generic server error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}