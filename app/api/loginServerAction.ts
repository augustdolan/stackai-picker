"use server"
import { signIn } from "@/auth";

export async function Login(formData: FormData) {
  "use server"
  formData.append("redirectTo", "/google-drive");
  await signIn("credentials", formData)
}
