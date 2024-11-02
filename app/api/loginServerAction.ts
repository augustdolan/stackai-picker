"use server"
import { signIn } from "@/auth";

export async function Login(formData: FormData) {
  "use server"
  formData.append("redirectTo", "/connections");
  await signIn("credentials", formData)
}
