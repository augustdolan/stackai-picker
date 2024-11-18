import { getRootResources } from "@/app/api/googleDriveResources";
import { Suspense } from "react";
import InteractiveDirectory from "@/components/connections/InteractiveDirectory";
import Directory from "./Directory";

// children are directories
export default async function RootDirectory({ connectionId }: { connectionId: string }) {
  const resources = await getRootResources(connectionId)
  const files = resources.filter((resource) => resource.inode_type === "file");
  const directories = resources.filter((resource) => resource.inode_type === "directory");
  console.log("from root", directories, files)
  return (
    <InteractiveDirectory pathParts={["Google Drive"]} resourceId={"Google Drive"} files={files}>
      {directories.map((directory) => (
        <Suspense key={directory.resource_id} fallback={<div>Loading...</div>}>
          <Directory pathParts={directory.inode_path.path.split("/")} connectionId={connectionId} resourceId={directory.resource_id} />
        </Suspense>
      ))}
    </InteractiveDirectory>
  )
}

