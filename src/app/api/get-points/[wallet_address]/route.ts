import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, { 
  params,
 }: { params: Promise<{ wallet_address: string }> }) {
  try {
    const { wallet_address } = await params;

    if (!wallet_address) {
      return NextResponse.json({ message: "Wallet address is required" }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.walletAddress, wallet_address)).execute();

    if (!user.length) {
      return NextResponse.json({ message: "Check again", points: 0 }, { status: 404 });
    }

    return NextResponse.json({ points: user[0].points }, { status: 200 });
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
