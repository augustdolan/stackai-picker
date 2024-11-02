import { auth } from "@/auth";
export async function stackAiFetch(slug: string, config?: RequestInit) {
  const session = await auth();
  const response = await fetch(`${process.env.STACKAI_BACKEND_URL}/${slug}`, {
    ...config,
    cache: "force-cache", // cache even when authorization headers are present
    next: {
      revalidate: 3600, // generally, refetch all calls at most every hour
    },
    headers: {
      ...config?.headers,
      // @ts-expect-error needed to extend the session, no quick way to extend type
      "Authorization": `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
    }
  })
  const parsed = await response.json();
  return parsed;
};

// everything is cached, so recalling this is no harm
// Also, obviously this could be extendeed to support multiple connections
export async function getConnection() {
  const connections = await stackAiFetch("connections?connection_provider=gdrive&limit1")
  return connections;
};
