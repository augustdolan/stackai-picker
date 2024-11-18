import { getResources } from "@/app/api/googleDriveResources";
import { Suspense } from "react";
import InteractiveDirectory from "@/components/connections/InteractiveDirectory";

// children are directories
export default async function Directory({ pathParts, connectionId, resourceId }: { pathParts: string[], connectionId: string, resourceId: string }) {
  const resources = await getResources({ connectionId, resourceId });
  const files = resources.filter((resource) => resource.inode_type === "file");
  const directories = resources.filter((resource) => resource.inode_type === "directory");
  return (
    <InteractiveDirectory pathParts={pathParts} resourceId={resourceId} files={files}>
      {directories.map((directory) => (
        <Suspense key={directory.resource_id} fallback={<div>Loading...</div>}>
          <Directory connectionId={connectionId} pathParts={directory.inode_path.path.split("/")} resourceId={directory.resource_id} />
        </Suspense>
      ))}
    </InteractiveDirectory>
  )
}
