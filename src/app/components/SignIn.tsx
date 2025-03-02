import { signIn } from "../../../auth"; // Import correctly

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("twitter")
      }}
    >
      <button type="submit">Signin with Twitter</button>
    </form>
  )
} 