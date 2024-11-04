import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { CheckedChangeContext, IsSelectAll, ShouldReset } from "@/context";

export function useResourceSelectionEffects({ isParentChecked, resourceId, setChecked, pathParts }: { isParentChecked: boolean, resourceId: string, setChecked: Dispatch<SetStateAction<boolean>>, pathParts: string[] }) {
  const checkedChangeHandler = useContext(CheckedChangeContext);
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

}

