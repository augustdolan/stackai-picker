import { auth } from "@/auth";
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
  const parsed: T = await response.json();
  return parsed;
};

