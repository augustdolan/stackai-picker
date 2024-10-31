import { stackAiFetch } from "../utils";

// everything is cached, so recalling this is no harm
export async function getConnection() {
  const connections = await stackAiFetch("connections?connection_provider=gdrive&limit1")
  return connections;
};
