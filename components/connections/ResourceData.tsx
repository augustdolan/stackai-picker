import { FileIcon } from "@radix-ui/react-icons";
import FolderIcon from "@/components/ui/FolderIcon";
import { Label } from "@/components/ui/label";
import { OptimisticIsSyncing } from "@/context";
import { useContext } from "react";

export default function ResourceData({ resourceName, isInKnowledgeBase, isFile }: { resourceName: string, isInKnowledgeBase: boolean, isFile: boolean }) {
  const optimizedIsSyncing = useContext(OptimisticIsSyncing);
  return (
    <div className="p-4 flex justify-center gap-2">
      {isFile ? <FileIcon /> : <FolderIcon />}
      <Label className="flex gap-2">
        <div>{resourceName}</div>
        {isInKnowledgeBase && <div className="text-xs text-gray-500">{optimizedIsSyncing ? "Indexing" : "Indexed"}</div>}
      </Label>
    </div>
  )
}

