import { db } from "@/db";
import { claimPoints, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { config } from "dotenv";
config();

const randomPoint = Number(process.env.NEXT_POINT_FIGURE_FOR_RANDOM);

export async function POST(req: NextRequest) {
     try {
    const { wallet_address } = await req.json();

    if (!wallet_address) {
      return NextResponse.json({ message: "Wallet address is required" }, { status: 400 });
    }

    const user = await db.select({ id: users.id, points: users.points })
                         .from(users)
                         .where(eq(users.walletAddress, wallet_address))
                         .execute();

    if (!user.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = user[0].id;
    const points = user[0].points ?? 0;

    const claimPointsData = await db.select().from(claimPoints).where(eq(claimPoints.userId, userId)).execute();

    if (!claimPointsData.length) {
      return NextResponse.json({ message: "Claim point data not found" }, { status: 404 });
    }

    const now = new Date();
    const nextTime = new Date(claimPointsData[0].nextAt!);

    if (now < nextTime) {
      return NextResponse.json({ message: "Wait for time to complete to earn point" }, { status: 404 });
    }

    await db.update(claimPoints)
            .set({
              updatedAt: now,
              nextAt: new Date(now.getTime() + 12 * 60 * 60 * 1000)
            })
            .where(eq(claimPoints.userId, userId))
            .execute();

    const point = Math.floor(Math.random() * randomPoint) + 1;
    const newPoints = points + point;

    await db.update(users)
            .set({ points: newPoints })
            .where(eq(users.id, userId))
            .execute();

     const updatedClaimPoint = await db.select().from(claimPoints).where(eq(claimPoints.userId, userId)).execute();

    const startTime = updatedClaimPoint[0].updatedAt;
    const stopTime = updatedClaimPoint[0].nextAt;

    return NextResponse.json({ message: `${point} is claimed, check next 12 hrs to claim another point`, points: newPoints, startTime, stopTime }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}