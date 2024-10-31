import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  } else {
    redirect('/google-drive')
  }
};


