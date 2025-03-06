import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateRandomCode } from "@/app/components/RandomCode";

export async function POST(req: Request) {
  try {
    const { wallet_address } = await req.json();

    if (!wallet_address) {
      return NextResponse.json({ message: "Wallet address is required" }, { status: 400 });
    }

    // Check if the wallet address already exists
    const existingUser = await db.select().from(users).where(eq(users.walletAddress, wallet_address)).execute();

    if (existingUser.length) {
      return NextResponse.json({ message: "Welcome Back" }, { status: 200 });
    }
    // Generate unique referralId
    let referralId = "";
    let isUnique = false;

    while (!isUnique) {
      referralId = generateRandomCode();
      const referralExist = await db.select().from(users).where(eq(users.referralId, referralId)).execute();
      if (referralExist.length === 0) {
        isUnique = true;
        break;
      }
    }

    // Insert new user with wallet address
    await db.insert(users).values({ 
      walletAddress: wallet_address,
      points: 100,
      referralId,
     }).execute();

    return NextResponse.json({ message: "Welcome to FLIPCOIN", points: 100 }, { status: 201 });
  } catch (error) {
    console.error("Error saving wallet address:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};