"use client";
import { twitterSignIn } from "../actions/auth";

export default function SignIn() {
  return (
    <form action={twitterSignIn}>
      <button type="submit">Signin with Twitter</button>
    </form>
  );
}
