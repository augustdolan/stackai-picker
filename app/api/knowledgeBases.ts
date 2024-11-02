"use server"
import { getConnections, stackAiFetch } from "@/app/api/utils"
import { auth } from "@/auth";

const defaultKnowledgeBaseId = "2ee47c79-f0c3-4cc0-af7a-ab2e479969a6";

// remove defaulting once KBs are selectable
// Additionally, note that this only triggers a sync to files you index to the KB, you must index files to the KB first
export async function syncToKnowledgeBase(knowledgeBaseId: string = defaultKnowledgeBaseId) {
  const session = await auth();
  const syncResponse = await stackAiFetch(`knowledge_bases/sync/trigger/${knowledgeBaseId}/${session?.orgId}`, {
    method: "GET",
  })
  return syncResponse;
}

export async function createKnowledgeBase(selectedResources: Set<string>) {
  const [connection] = await getConnections();
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

export async function updateKnowledgeBase(knowledgeBaseId: string = defaultKnowledgeBaseId, selectedResources: Set<string>) {
  const [connection] = await getConnections();
  const knowledgeBase = await stackAiFetch(`knowledge_bases/${knowledgeBaseId}`, {
    method: "PUT",
    body: JSON.stringify({
      connection_source_ids: Array.from(selectedResources),
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
    }),
  })
  return knowledgeBase;
}
