import { FileIcon } from "@radix-ui/react-icons";
import FolderIcon from "@/components/ui/FolderIcon";
import { Label } from "@/components/ui/label";

// need to redo isInKnowledgeBase and therefor remove optional
export default function ResourceData({ resourceName, isFile }: { resourceName: string, isInKnowledgeBase?: boolean, isFile: boolean }) {
  return (
    <div className="p-4 flex justify-center gap-2">
      {isFile ? <FileIcon /> : <FolderIcon />}
      <Label className="flex gap-2">
        <div>{resourceName}</div>
      </Label>
    </div>
  )
}

