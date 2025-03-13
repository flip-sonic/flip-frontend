import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { claimPoints, referrals, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateRandomCode } from "@/app/components/RandomCode";
import { config } from "dotenv";
config();

const registerPoint = Number(process.env.NEXT_POINT_FOR_REGISTRATION);
const referralPoint = Number(process.env.NEXT_POINT_FOR_REFERRAL);

export async function POST(req: NextRequest) {
  try {
    const { wallet_address, referred_by } = await req.json();

    if (!wallet_address) {
      return NextResponse.json({ message: "Wallet address is required" }, { status: 400 });
    }

    // Check if the wallet address already exists
    const existingUser = await db.select().from(users).where(eq(users.walletAddress, wallet_address)).execute();

    if (existingUser.length) {
      const userData = existingUser[0];
      return NextResponse.json({ message: "Welcome Back", userData }, { status: 200 });
    }

    let referrerUser = null;

    if (referred_by) {
      // Check if the referral code exists in the user table
      const referrerResult = await db.select().from(users).where(eq(users.referralId, referred_by)).execute();
      if (referrerResult.length) {
        referrerUser = referrerResult[0];
      }
    }

    // Generate unique referralId
    let referralId = "";
    let isUnique = false;

    while (!isUnique) {
      referralId = generateRandomCode();
      const referralExists = await db.select().from(users).where(eq(users.referralId, referralId)).execute();
      if (referralExists.length === 0) {
        isUnique = true;
      }
    }

    // Insert new user with wallet address
    const newUserResult = await db.insert(users).values({
      walletAddress: wallet_address,
      points: registerPoint,
      referralId,
    }).returning().execute();

    const newUser = newUserResult[0];

     const now = new Date();

    const claimPoint = await db.insert(claimPoints).values({
      userId: newUser.id,
      updatedAt: now,
      nextAt: new Date(now.getTime() + 12 * 60 * 60 * 1000)
    }).returning().execute();

    const startTime = claimPoint[0].updatedAt;
    const stopTime = claimPoint[0].nextAt;

    if (referrerUser) {
      // Insert referral record
      await db.insert(referrals).values({
        userId: referrerUser.id,
        referredId: newUser.id,
      }).execute();

      // Update referrer's points
      const currentPoints = referrerUser.points ?? 0;
      const newPoints = currentPoints + referralPoint;

      await db
        .update(users)
        .set({ points: newPoints })
        .where(eq(users.id, referrerUser.id))
        .execute();
    }

    return NextResponse.json({ message: "Welcome to FLIPCOIN", userData: newUser, startTime, stopTime }, { status: 201 });
  } catch (error) {
    console.error("Error saving wallet address:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
