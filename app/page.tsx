import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DriveResourceContainer from "@/components/DriveResourceContainer";
import SignIn from "@/components/SignIn";

export default async function Home() {
  const session = await auth();
  console.log("Hugh")
  if (!session?.user) {
    redirect('/sign-in');
  } else {
    redirect('/google-drive')
  }
}


