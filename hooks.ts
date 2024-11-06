import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { CheckedChangeContext, IsSelectAll, OptimisticIsSyncing, ShouldReset } from "@/context";

export function useResourceSelectionEffects({ checked, setIsInKnowledgeBase, isParentChecked, resourceId, setChecked, pathParts }: { checked: boolean, setIsInKnowledgeBase: Dispatch<SetStateAction<boolean>>, isParentChecked: boolean, resourceId: string, setChecked: Dispatch<SetStateAction<boolean>>, pathParts: string[] }) {
  const checkedChangeHandler = useContext(CheckedChangeContext);
  const optimizedIsSyncing = useContext(OptimisticIsSyncing);
  const shouldReset = useContext(ShouldReset);
  useEffect(() => {
    if (shouldReset) {
      checkedChangeHandler({ isParentChecked: false, checkedState: false, resourceId, setChecked });
    }
  }, [shouldReset, resourceId])

  useEffect(() => {
    checkedChangeHandler({ isParentChecked, checkedState: isParentChecked, resourceId, setChecked });
  }, [isParentChecked, resourceId]);
  const isSelectAll = useContext(IsSelectAll);
  useEffect(() => {
    // if resource in root directory
    if (isSelectAll && pathParts.length === 1) {
      checkedChangeHandler({ isParentChecked: false, checkedState: true, resourceId, setChecked });
    }
  }, [isSelectAll, pathParts.length, resourceId])


  const [alreadyFlipped, setAlreadyFlipped] = useState(false);
  useEffect(() => {
    if (optimizedIsSyncing && !alreadyFlipped) {
      setAlreadyFlipped(true)
      if (checked) {
        setIsInKnowledgeBase(true);
      } else {
        setIsInKnowledgeBase(false)
      }
    } else if (!optimizedIsSyncing) {
      setAlreadyFlipped(false);
    }
  }, [optimizedIsSyncing, checked])
}

