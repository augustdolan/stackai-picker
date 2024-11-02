import { stackAiFetch } from "@/app/api/utils"
import { ConnectionInfo } from "@/types/googleDrive";
export async function getConnections() {
  const connections = await stackAiFetch<ConnectionInfo[]>("connections?connection_provider=gdrive&limit1")
  return connections;
};

