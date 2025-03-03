"use server";

import { signIn } from "../../../auth";

export async function twitterSignIn() {
  await signIn("twitter");
}
