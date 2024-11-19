"use client"
import { CheckedChangeContext, IsParentChecked, OptimisticIsSyncing } from "@/context";
import { useResourceSelectionEffects } from "@/hooks";
import { useContext, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import ResourceData from "@/components/connections/ResourceData";

export default function File({ name, originalIsInKnowledgeBase, pathParts }: { name: string, pathParts: string[], originalIsInKnowledgeBase: boolean }) {
  const [checked, setChecked] = useState(false);
  const [, setIsInKnowledgeBase] = useState(originalIsInKnowledgeBase);
  const isParentChecked = useContext(IsParentChecked);
  const optimisticIsSyncing = useContext(OptimisticIsSyncing);
  useResourceSelectionEffects({ isParentChecked, resourceId: name, setChecked, pathParts, checked, setIsInKnowledgeBase });
  const checkedChangeHandler = useContext(CheckedChangeContext);
  return (
    <div className="resource-info">
      <Checkbox onClick={((e) => e.stopPropagation())} checked={isParentChecked || checked} disabled={optimisticIsSyncing || isParentChecked} onCheckedChange={(checkedState) => { checkedChangeHandler({ isParentChecked, checkedState, resourceId: name, setChecked }) }} className="self-center" />
      <ResourceData isInKnowledgeBase={false} isFile={true} resourceName={pathParts[pathParts.length - 1]} />
    </div>
  );
}

