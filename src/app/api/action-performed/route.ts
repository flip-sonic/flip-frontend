import { db } from "@/db";
import { actions, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import TwitterApi, { ApiResponseError } from "twitter-api-v2";

const TWEET_ID = process.env.NEXT_TWITTER_TWEET_ID!;

const client = new TwitterApi({
    appKey: process.env.NEXT_TWITTER_API_KEY!,
    appSecret: process.env.NEXT_TWITTER_API_SECRET_KEY!,
    accessToken: process.env.NEXT_TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.NEXT_TWITTER_ACCESS_TOKEN_SECRET!,
});

const ACTION_TYPES = {
  JOIN: "join",
  RETWEET: "retweet",
  LIKE: "like",
  FOLLOW: "follow",
};

export async function POST(req: NextRequest) {
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

    if (!twitterId) {
      return NextResponse.json(
        { message: "Twitter account not linked" },
        { status: 404 }
      );
    }

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

    // Introduce a delay for certain actions
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    if (actionType === ACTION_TYPES.RETWEET) {
      await delay(10000);
      const twitterResponse = await client.v2.tweetRetweetedBy(TWEET_ID);

      const foundUsers = twitterResponse.data || [];
      const isActionValid = foundUsers.some((user) => user.id === twitterId);

      if (!isActionValid) {
        return NextResponse.json(
          { message: `User didn't perform ${actionType}` },
          { status: 403 }
        );
      }
    } else {
      await delay(10000);
    }

    // Use a transaction to ensure atomicity
    const transactionResult = await db.transaction(async (tx) => {
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

      // Return the result of the transaction
      return { newPoints, actionType };
    });

    // Return the response after the transaction
    return NextResponse.json(
      {
        message: `${transactionResult.actionType} action performed and points updated`,
        newPoints: transactionResult.newPoints,
        actionType: transactionResult.actionType,
      },
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
