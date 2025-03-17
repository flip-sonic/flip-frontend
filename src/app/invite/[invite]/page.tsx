"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ invite: string }> }) {
  const [invite, setInvite] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchInvite() {
      try {
        const inviteData = await params;
        setInvite(inviteData.invite);
      } catch (error) {
        console.error("Failed to fetch invite:", error);
      }
    }

    fetchInvite();
  }, [params]);

  useEffect(() => {
    if (invite) {
      localStorage.setItem("referralId", invite);
      router.replace("/points");
    }
  }, [invite, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-white text-2xl">Loading...</p>
    </div>
  );
}
