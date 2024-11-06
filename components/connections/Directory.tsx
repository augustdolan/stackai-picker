import { CheckedChangeContext, OptimisticIsSyncing } from "@/context";
import { useResourceSelectionEffects } from "@/hooks";
import { ResourcesByDirectory } from "@/types/googleDrive";
import { useContext, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ResourceData from "@/components/connections/ResourceData";
import File from "@/components/connections/File";

export default function Directory({ isParentChecked, directoryName, directoryInfo }: { isParentChecked: boolean, directoryName: string, directoryInfo: ResourcesByDirectory }) {
  const checkedChangeHandler = useContext(CheckedChangeContext);
  const info = directoryInfo.resourceData;
  const resourceId = info.resource_id;
  const files = Object.entries(directoryInfo.directoryEntries.files);
  const directories = Object.entries(directoryInfo.directoryEntries.directories);
  const [checked, setChecked] = useState(false);
  const optimisticIsSyncing = useContext(OptimisticIsSyncing);
  const [isInKnowledgeBase, setIsInKnowledgeBase] = useState(directoryInfo.resourceData.isInKnowledgeBase);
  useResourceSelectionEffects({ isParentChecked, resourceId, setChecked, pathParts: info.inode_path.path.split("/"), checked, setIsInKnowledgeBase });
  return (
    <>
      <div className="resource-info">
        {directoryName !== "Google Drive" && <Checkbox onClick={((e) => e.stopPropagation())} disabled={optimisticIsSyncing || isParentChecked} checked={isParentChecked || checked} onCheckedChange={(checkedState) => { checkedChangeHandler({ isParentChecked, checkedState, resourceId, setChecked }) }} className="self-center" />}
        <AccordionTrigger className="flex content-center gap-2" >
          <ResourceData isFile={false} isInKnowledgeBase={isInKnowledgeBase} resourceName={directoryName} />
        </AccordionTrigger>
      </div>
      <AccordionContent className="pl-8">
        {directories.length > 0 &&
          <Accordion type="multiple">
            {directories.map(([directoryName, directoryInfo]) =>
              <AccordionItem key={directoryInfo.resourceData.resource_id} value={directoryInfo.resourceData.resource_id}>
                <Directory isParentChecked={checked} directoryName={directoryName} directoryInfo={directoryInfo} />
              </AccordionItem>
            )}
          </Accordion>}
        {files.map(([fileName, fileMetadata]) => <File key={fileMetadata.resourceData.resource_id} fileName={fileName} fileMetadata={fileMetadata} isParentChecked={checked} />)}
      </AccordionContent>
    </>
  )
}

