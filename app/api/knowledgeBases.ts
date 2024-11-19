"use server"
import { auth } from "@/auth";
import { stackAiFetch } from "@/app/api/utils";
import { getConnections } from "@/app/api/connections";
import { DriveResource } from "@/types/googleDrive";

const defaultKnowledgeBaseId = "2ee47c79-f0c3-4cc0-af7a-ab2e479969a6";

// TODO: create single responsibility for core rsource fetching between google and kb
export async function getKnowledgeBaseInfo({ knowledgeBaseId = defaultKnowledgeBaseId, }: { knowledgeBaseId?: string }) {
  const rootResources: DriveResource[] = await stackAiFetch(`knowledge_bases/${knowledgeBaseId}/resources/children?resource_path=/`)
  return rootResources;
}

export async function syncToKnowledgeBase(knowledgeBaseId: string = defaultKnowledgeBaseId) {
  const session = await auth();
  const syncResponse = await stackAiFetch(`knowledge_bases/sync/trigger/${knowledgeBaseId}/${session?.orgId}`, {
    method: "GET",
  })
  return syncResponse;
}

export async function createKnowledgeBase(selectedResources: Set<string>) {
  const connections = await getConnections();
  const knowledgeBase = await stackAiFetch("knowledge_bases", {
    method: "POST",
    body: JSON.stringify({
      connection_source_ids: Array.from(selectedResources),
      description: "test description",
      connection_id: connections[0].connection_id,
      indexing_params: {
        ocr: false,
        unstructured: true,
        embedding_params: {
          embedding_model: "text-embedding-ada-022",
          api_key: null,
        },
        chunker_params: {
          chunk_size: 1500,
          chunk_overlap: 500,
          chunker: "sentence",
        }
      },
      name: "test name",
      org_level_role: null,
      cron_job_id: null,
    }),
  })
  return knowledgeBase;
}

// should update app directory to put knowledge base in URL...likely as a path before connection since there a many to one relationship with connections...
export async function updateKnowledgeBase({ knowledgeBaseId = defaultKnowledgeBaseId, selectedResources, connectionId }: { knowledgeBaseId?: string, selectedResources: Set<string>, connectionId: string }) {
  const session = await auth();
  await stackAiFetch(`knowledge_bases/${knowledgeBaseId}`, {
    method: "PUT",
    body: JSON.stringify({
      org_id: session?.orgId,
      connection_source_ids: Array.from(selectedResources),
      connection_id: connectionId,
      indexing_params: {
        ocr: false,
        unstructured: true,
        embedding_params: {
          embedding_model: "text-embedding-ada-022",
          api_key: null,
        },
        chunker_params: {
          chunk_size: 1500,
          chunk_overlap: 500,
          chunker: "sentence",
        }
      },
    }),
  })
  await syncToKnowledgeBase(knowledgeBaseId);
  const knowledgeBaseResources = await getKnowledgeBaseInfo({ knowledgeBaseId });
  return knowledgeBaseResources;
}

export async function getKnowledgeBaseResourceList() {

}
