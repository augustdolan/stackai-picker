import { signIn } from "@/auth"
import { Button } from "./ui/button"

export default function SignIn() {
  return (
    <form
      className="flex justify-center h-full"
      action={async () => {
        "use server"
        await signIn("credentials", { redirectTo: "/" })
      }}
    >
      <Button className="self-center" type="submit">Sign in</Button>
    </form>
  )
}

