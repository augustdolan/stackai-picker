import { DriveResource } from "@/types/googleDrive";
import { FileIcon } from "@radix-ui/react-icons";
import FolderIcon from "@/components/ui/FolderIcon";
import { Label } from "@/components/ui/label";

export default function ResourceData({ resourceName, isFile }: { resourceName: string, resourceMetadata: DriveResource, isFile: boolean }) {
  return (
    <div className="p-4 flex justify-center gap-2">
      {isFile ? <FileIcon /> : <FolderIcon />}
      <Label>
        <div>{resourceName}</div>
      </Label>
    </div>
  )
}

