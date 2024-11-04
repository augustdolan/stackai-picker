import { CheckedChangeContext } from "@/context";
import { useResourceSelectionEffects } from "@/hooks";
import { DriveResource } from "@/types/googleDrive";
import { useContext, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import ResourceData from "@/components/connections/ResourceData";

export default function File({ isParentChecked, fileName, fileMetadata }: { isParentChecked: boolean, fileName: string, fileMetadata: { resourceData: DriveResource } }) {
  const resourceId = fileMetadata.resourceData.resource_id;
  const [checked, setChecked] = useState(false);
  useResourceSelectionEffects({ isParentChecked, resourceId, setChecked, pathParts: fileMetadata.resourceData.inode_path.path.split("/") });
  const checkedChangeHandler = useContext(CheckedChangeContext);
  return (
    <div className="resource-info" key={fileMetadata.resourceData.resource_id}>
      <Checkbox onClick={((e) => e.stopPropagation())} checked={isParentChecked || checked} disabled={isParentChecked} onCheckedChange={(checkedState) => { checkedChangeHandler({ isParentChecked, checkedState, resourceId, setChecked }) }} className="self-center" />
      <ResourceData isFile={true} resourceName={fileName} resourceMetadata={fileMetadata.resourceData} />
    </div>
  );
}

