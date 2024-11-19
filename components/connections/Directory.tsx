import { getResources, getRootResources } from "@/app/api/googleDriveResources";
import { Suspense } from "react";
import InteractiveDirectory from "@/components/connections/InteractiveDirectory";
import { Skeleton } from "../ui/skeleton";
import { Accordion } from "../ui/accordion";
import File from "./File";

// children are directories
type DirectoryProps = { connectionId: string, resourceId: string } | { connectionId: string, isRoot: boolean };
export default async function Directory(props: DirectoryProps) {
  const isRoot = "isRoot" in props;
  const resources = isRoot ? await getRootResources(props.connectionId) : await getResources({ connectionId: props.connectionId, resourceId: props.resourceId });
  const files = resources.filter((resource) => resource.inode_type === "file");
  const directories = resources.filter((resource) => resource.inode_type === "directory");
  return (
    <>
      <Accordion type="multiple">
        {directories.map(directory => {
          const pathParts = directory.inode_path.path.split("/");
          return (
            <InteractiveDirectory key={directory.resource_id} resourceId={directory.resource_id} pathParts={pathParts} >
              <Suspense key={directory.resource_id} fallback={<Skeleton className="h-4 w-50% m-2" />}>
                <Directory connectionId={props.connectionId} resourceId={directory.resource_id} />
              </Suspense>
            </InteractiveDirectory>
          )
        }
        )}
      </Accordion>
      {files.map((file) => <File key={file.resource_id} originalIsInKnowledgeBase={false} name={file.resource_id} pathParts={file.inode_path.path.split("/")} />
      )}
    </>
  )
}
