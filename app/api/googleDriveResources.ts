import { stackAiFetch } from "@/app/api/utils"
import { DriveResource, ResourcesByDirectory } from "@/types/googleDrive";

export async function getAllDriveResources(connectionId: string) {
  const rootResources: DriveResource[] = await stackAiFetch(`connections/${connectionId}/resources/children`)
  const allResources = await fetchInnerResources(rootResources, connectionId)
  const resourcesByDirectory = organizeByDirectory(allResources);
  return resourcesByDirectory;
}

async function fetchInnerResources(resources: DriveResource[], connectionId: string) {
  const allResources = [...resources];
  let directoriesQueue: DriveResource[] = resources.filter((resource) => resource.inode_type === "directory");
  while (directoriesQueue.length) {
    const hydratedDirectories = await Promise.allSettled<DriveResource[]>(directoriesQueue.map(async (directory) => stackAiFetch(`connections/${connectionId}/resources/children?resource_id=${directory.resource_id}`)))
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
  const resourceData = {} as DriveResource;
  const resourcesByDirectory: ResourcesByDirectory = { resourceData, directoryEntries: {} };
  resources.forEach(resource => {
    const subPaths = resource.inode_path.path.split("/")
    let currentPath = resourcesByDirectory.directoryEntries
    for (let i = 0; i < subPaths.length; i++) {
      if (i === subPaths.length - 1) {
        currentPath[subPaths[i]] = {
          ...currentPath[subPaths[i]],
          resourceData: resource,
        };
      } else {
        if (currentPath[subPaths[i]] === undefined || currentPath[subPaths[i]].directoryEntries === undefined) {
          currentPath[subPaths[i]] = {
            ...currentPath[subPaths[i]],
            directoryEntries: {},
          };
        }
        currentPath = currentPath[subPaths[i]].directoryEntries
      }
    }
  })
  return resourcesByDirectory;
}
