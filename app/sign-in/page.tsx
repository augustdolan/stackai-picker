import { Button } from "@/components/ui/button";
import { signIn } from "@/auth"
import SignIn from "@/components/SignIn";

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

export default function SignInPage() {
  return <SignIn />;
}

