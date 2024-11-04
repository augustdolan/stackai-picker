import { stackAiFetch } from "@/app/api/utils"
import { DriveResource, ResourcesByDirectory } from "@/types/googleDrive";

export async function getAllDriveResources(connectionId: string) {
  const resourcesByDirectories = await getAllResources(`connections/${connectionId}`);
  return resourcesByDirectories;
}

// only fetched root because there seems to be a bug with syncing that always results in a 500 error
export async function getAllKnowledgeBaseResources(knowledgeBaseId: string) {
  const rootResources: DriveResource[] = await stackAiFetch(`knowledge_bases/${knowledgeBaseId}/resources/children?resource_path=/`)
  return rootResources;
}
export async function getAllResources(resourceSlug: string) {
  const rootResources: DriveResource[] = await stackAiFetch(`${resourceSlug}/resources/children`)
  const allResources = await fetchInnerResources(rootResources, resourceSlug)
  const resourcesByDirectory = organizeByDirectory(allResources);
  return resourcesByDirectory;
}

async function fetchInnerResources(resources: DriveResource[], resourceSlug: string) {
  const allResources = [...resources];
  let directoriesQueue: DriveResource[] = resources.filter((resource) => resource.inode_type === "directory");
  while (directoriesQueue.length) {
    const hydratedDirectories = await Promise.allSettled(directoriesQueue.map(async (directory) => stackAiFetch<DriveResource[]>(`${resourceSlug}/resources/children?resource_id=${directory.resource_id}`)))
    const newDirectoriesQueue: DriveResource[] = [];
    hydratedDirectories.forEach(directory => {
      if (directory.status === "fulfilled") {
        directory.value.forEach(resource => {
          if (resource.inode_type === "directory") {
            newDirectoriesQueue.push(resource);
          }
          allResources.push(resource);
        })
      } else {
      }
    })
    directoriesQueue = newDirectoriesQueue;
  }
  return allResources;

}

// non-ideal organization
function organizeByDirectory(resources: DriveResource[]): ResourcesByDirectory {
  const resourceData = {
    resource_id: "SHIMROOTID",
    inode_path: { path: "poor/default/to/prevent/select/all" },
  } as DriveResource;
  const resourcesByDirectory: ResourcesByDirectory = {
    resourceData, directoryEntries: {
      files: {},
      directories: {},
    }
  };
  resources.forEach(resource => {
    const subPaths = resource.inode_path.path.split("/")
    let currentDirectoryEntriesPath = resourcesByDirectory.directoryEntries
    for (let i = 0; i < subPaths.length; i++) {
      const currentSubPathName = subPaths[i];
      if (i === subPaths.length - 1) {
        if (resource.inode_type === "directory") {
          // this case is over engineered
          currentDirectoryEntriesPath.directories[currentSubPathName] = {
            ...currentDirectoryEntriesPath.directories[currentSubPathName], // unlikely any data in this scenario
            resourceData: resource,
            directoryEntries: {
              files: currentDirectoryEntriesPath.directories[currentSubPathName]?.directoryEntries?.files ?? {},
              directories: currentDirectoryEntriesPath.directories[currentSubPathName]?.directoryEntries?.directories ?? {},
            },
          };
        } else {
          currentDirectoryEntriesPath.files[currentSubPathName] = {
            resourceData: resource,
          }

        }
      } else {
        if (currentDirectoryEntriesPath.directories[currentSubPathName] === undefined) {
          currentDirectoryEntriesPath.directories[currentSubPathName] = {
            resourceData: {} as DriveResource,
            directoryEntries: {
              files: {},
              directories: {},
            },
          };
        }
        currentDirectoryEntriesPath = currentDirectoryEntriesPath.directories[currentSubPathName].directoryEntries
      }
    }
  })
  return resourcesByDirectory;
}
