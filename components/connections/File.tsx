import { CheckedChangeContext, OptimisticIsSyncing } from "@/context";
import { useResourceSelectionEffects } from "@/hooks";
import { DriveResourceWithKnowledgeBaseInfo } from "@/types/googleDrive";
import { useContext, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import ResourceData from "@/components/connections/ResourceData";

export default function File({ isParentChecked, fileName, fileMetadata }: { isParentChecked: boolean, fileName: string, fileMetadata: { resourceData: DriveResourceWithKnowledgeBaseInfo } }) {
  const resourceId = fileMetadata.resourceData.resource_id;
  const [checked, setChecked] = useState(false);
  const [isInKnowledgeBase, setIsInKnowledgeBase] = useState(fileMetadata.resourceData.isInKnowledgeBase);
  const optimisticIsSyncing = useContext(OptimisticIsSyncing);
  useResourceSelectionEffects({ isParentChecked, resourceId, setChecked, pathParts: fileMetadata.resourceData.inode_path.path.split("/"), checked, setIsInKnowledgeBase });
  const checkedChangeHandler = useContext(CheckedChangeContext);
  return (
    <div className="resource-info" key={fileMetadata.resourceData.resource_id}>
      <Checkbox onClick={((e) => e.stopPropagation())} checked={isParentChecked || checked} disabled={optimisticIsSyncing || isParentChecked} onCheckedChange={(checkedState) => { checkedChangeHandler({ isParentChecked, checkedState, resourceId, setChecked }) }} className="self-center" />
      <ResourceData isInKnowledgeBase={isInKnowledgeBase} isFile={true} resourceName={fileName} />
    </div>
  );
}

