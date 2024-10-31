import { auth } from "@/auth";
export async function stackAiFetch(slug: string, config?: RequestInit) {
  const session = await auth();
  const response = await fetch(`${process.env.STACKAI_BACKEND_URL}/${slug}`, {
    ...config,
    cache: "force-cache",
    headers: {
      ...config?.headers,
      "Authorization": `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
    }
  })
  const parsed = await response.json();
  return parsed;
};
