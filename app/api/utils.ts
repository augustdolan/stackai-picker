import { auth } from "@/auth";
import { redirect } from "next/navigation";
export async function stackAiFetch<T>(slug: string, config?: RequestInit) {
  const session = await auth();
  const response = await fetch(`${process.env.STACKAI_BACKEND_URL}/${slug}`, {
    ...config,
    headers: {
      ...config?.headers,
      "Authorization": `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
    }
  })
  // should make an OR with type narrowing
  const parsed: T & { detail?: string } = await response.json();
  // escape hatch when api call fails
  if (parsed.detail?.toLowerCase() === "not authenticated") {
    redirect("/sign-in");
  }
  return parsed;
};

