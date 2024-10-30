import { Button } from "@/components/ui/button";
import { signIn } from "@/auth"

// export default function SignInPage() {
//   async function signInWithDefault() {
//     "use server"
//     await signIn("credentials", { redirectTo: "/" });
//   }
//   return (
//     <Button onClick={() => {
//       signInWithDefault()
//     }}>Default Login</Button>
//   )
// }

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("credentials", { redirectTo: "/" })
      }}
    >
      <Button type="submit">Sign in</Button>
    </form>
  )
}
