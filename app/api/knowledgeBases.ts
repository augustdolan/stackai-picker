"use server"
import { auth } from "@/auth";
import { stackAiFetch } from "@/app/api/utils";
import { getConnections } from "@/app/api/connections";
import { getAllKnowledgeBaseResources } from "./googleDriveResources";

const defaultKnowledgeBaseId = "2ee47c79-f0c3-4cc0-af7a-ab2e479969a6";

export async function syncToKnowledgeBase(knowledgeBaseId: string = defaultKnowledgeBaseId) {
  const session = await auth();
  return new Promise((resolve) => {
    // set timeout was to see if we need to wait a moment before syncing. Tested 15 seconds, was no help
    setTimeout(async () => {
      const syncResponse = await stackAiFetch(`knowledge_bases/sync/trigger/${knowledgeBaseId}/${session?.orgId}`, {
        method: "GET",
      })
      return resolve(syncResponse);
    }, 1000)

  })
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
  // 500ing and difficult to debug. ensured the call was the same as on your site. The 500 return also isn't returned as JSON, which causes a crash
  await syncToKnowledgeBase(knowledgeBaseId);
  // this fetch is currently fetching outdated info, as the syncToKnowledge base is always 500ing
  const knowledgeBaseResources = await getAllKnowledgeBaseResources(knowledgeBaseId);
  // not making use of return since it is outdated
  return knowledgeBaseResources;
}

export async function getKnowledgeBaseResourceList() {

}
