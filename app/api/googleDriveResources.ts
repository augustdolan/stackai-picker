import { stackAiFetch } from "@/app/api/utils"
import { DriveResource, DriveResourceWithKnowledgeBaseInfo, ResourcesByDirectory } from "@/types/googleDrive";

export async function getResources({ connectionId, resourceId }: { connectionId: string, resourceId: string }) {
  const resource = await stackAiFetch<DriveResource[]>(`connections/${connectionId}/resources/children?resource_id=${resourceId}`)
  return resource;
}

export async function getRootResources(connectionId: string) {
  const rootResources = await stackAiFetch<DriveResource[]>(`connections/${connectionId}/resources/children`)
  return rootResources;
}
