"use server"
import { stackAiFetch } from "./utils"
import { getConnection } from "./googleDrive/utils"
import { auth } from "@/auth";

const defaultKnowledgeBaseId = "2ee47c79-f0c3-4cc0-af7a-ab2e479969a6";

export async function syncToKnowledgeBase(selectedResources: Set<string>, knowledgeBaseId: string = defaultKnowledgeBaseId) {
  const session = await auth();
  const [connection] = await getConnection();
  const knowledgeBase = await stackAiFetch(`knowledge_bases/sync/trigger/${knowledgeBaseId}/${session?.orgId}`, {
    method: "POST",
    body: JSON.stringify({
      connection_source_ids: Array.from(selectedResources),
      connection_id: connection.connection_id,
    }),
  })
  return knowledgeBase;
}

export async function createKnowledgeBase(selectedResources: Set<string>) {
  const [connection] = await getConnection();
  const knowledgeBase = await stackAiFetch("knowledge_bases", {
    method: "POST",
    body: JSON.stringify({
      connection_source_ids: Array.from(selectedResources),
      description: "test description",
      connection_id: connection.connection_id,
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

