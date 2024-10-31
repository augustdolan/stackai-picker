import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation"

export default function SignIn() {
  return (
    <div className="flex justify-center h-full">
      <Card className="p-8 w-1/2 self-center">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <form
          className="flex gap-4 flex-col"
          action={async (formData) => {
            "use server"
            await signIn("credentials", formData)
            redirect("/google-drive");
          }}
        >
          <label>
            Email
            <Input name="email" type="email" />
          </label>
          <label>
            Password
            <Input name="password" type="password" />
          </label>
          <Button className="self-center" type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  )
}
