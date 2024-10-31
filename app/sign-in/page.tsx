"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useOptimistic } from "react";
import { Login } from "@/app/api/loginServerAction"

export default function SignIn() {
  const [optimisticLoggingIn, toggleOptimisticLoggingIn] = useOptimistic(false);
  return (
    <div className="flex justify-center h-full">
      <Card className="p-8 w-1/2 self-center">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <form
          className="flex gap-4 flex-col"
          action={(formData) => {
            Login(formData)
            toggleOptimisticLoggingIn(true)
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
        {optimisticLoggingIn && <div>Logging you in...</div>}
      </Card>
    </div >
  )
}
