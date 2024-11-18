"use client"
import { CheckedChangeContext, IsParentChecked, OptimisticIsSyncing } from "@/context";
import { useResourceSelectionEffects } from "@/hooks";
import { useContext, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ResourceData from "@/components/connections/ResourceData";
import File from "@/components/connections/File";
import { FileDriveResource } from "@/types/googleDrive";

export default function InteractiveDirectory({ pathParts, children, files, resourceId }: { pathParts: string[], children: React.ReactNode, files: FileDriveResource[], resourceId: string }) {
  const checkedChangeHandler = useContext(CheckedChangeContext);
  const isParentChecked = useContext(IsParentChecked);
  const [checked, setChecked] = useState(false);
  const optimisticIsSyncing = useContext(OptimisticIsSyncing);
  // const [isInKnowledgeBase, setIsInKnowledgeBase] = useState(directoryInfo.isInKnowledgeBase); // TODO: reimplmenet is in knowledgebase
  useResourceSelectionEffects({ isParentChecked, resourceId, setChecked, pathParts, checked, setIsInKnowledgeBase: () => { } });

  return (
    <AccordionItem value={resourceId}>
      <div className="resource-info">
        <Checkbox onClick={((e) => e.stopPropagation())} disabled={optimisticIsSyncing || isParentChecked} checked={isParentChecked || checked} onCheckedChange={(checkedState) => { checkedChangeHandler({ isParentChecked: false, checkedState, resourceId, setChecked }) }} className="self-center" />
        <AccordionTrigger className="flex content-center gap-2" >
          <ResourceData isFile={false} resourceName={pathParts[pathParts.length - 1]} />
        </AccordionTrigger>
      </div>
      <AccordionContent className="px-8">
        <Accordion type="multiple">
          <IsParentChecked.Provider value={isParentChecked || checked}>
            {children}
          </IsParentChecked.Provider>
        </Accordion>
        {files.map((file) => <File key={file.resource_id} originalIsInKnowledgeBase={false} name={file.resource_id} pathParts={file.inode_path.path.split("/")} isParentChecked={checked} />)}
      </AccordionContent>
    </AccordionItem>
  )
}
