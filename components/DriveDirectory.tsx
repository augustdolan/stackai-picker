import { FileIcon } from "@radix-ui/react-icons"
import FolderIcon from "@/components/ui/FolderIcon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedChangeHandler, ResourcesByDirectory } from "@/types/googleDrive";
type IsChecked = "indeterminate" | boolean;

type DirectoryChildProps = {
  isSelectAll?: boolean,
  name: string,
  info: ResourcesByDirectory,
  handleCheckedChange: CheckedChangeHandler,
  isParentChecked: IsChecked,
}

function directoryUseEffect() {

}
export function DriveDirectory({ isSelectAll, name, info, handleCheckedChange, isParentChecked }: DirectoryChildProps) {
  const [checked, setChecked] = useState<IsChecked>(false)
  const resourceId = info.resourceData.resource_id;
  useEffect(() => {
    // these equality checks are due to the possibility of an "indeterminate" string for the value of checked
    if (isParentChecked === true) {
      setChecked(false);
      if (isSelectAll) {
        handleCheckedChange(true, resourceId);
      } else {
        handleCheckedChange(false, resourceId);
      }
    }
  }, [isSelectAll, isParentChecked, resourceId])
  return (
    <Accordion type="multiple">
      <AccordionItem value={resourceId ?? "Google Drive"}> {/* poor defaulting */}
        <div className="border-b p-2 flex content-center gap-2">
          {resourceId && <Checkbox disabled={isParentChecked === true} checked={isParentChecked || checked} onCheckedChange={(checkedState) => {
            setChecked(checkedState);
            handleCheckedChange(checkedState, resourceId)
          }} className="self-center" />}
          <AccordionTrigger ><FolderIcon />{name}</AccordionTrigger>
        </div>
        {Object.entries(info.directoryEntries).map(([entryName, entryInfo]) => {
          return (
            <AccordionContent key={entryInfo.resourceData.resource_id} className="pl-8">
              {entryInfo.resourceData.inode_type === "directory" ?
                <DriveDirectory isSelectAll={isParentChecked === true && name === "Google Drive"} name={entryName} info={entryInfo} handleCheckedChange={handleCheckedChange} isParentChecked={isParentChecked || checked} /> :
                <FileView isSelectAll={isParentChecked === true && name === "Google Drive"} name={entryName} info={entryInfo} handleCheckedChange={handleCheckedChange} isParentChecked={isParentChecked || checked} />}
            </AccordionContent>
          )
        })}
      </AccordionItem>
    </ Accordion>
  )
}

function FileView({ isSelectAll, name, info, handleCheckedChange, isParentChecked }: DirectyChildProps) {
  const [checked, setChecked] = useState<IsChecked>(false)
  const resourceId = info.resourceData.resource_id
  useEffect(() => {
    // these equality checks are due to the possibility of an "indeterminate" string for the value of checked
    if (isParentChecked === true) {
      setChecked(false);
      if (isSelectAll) {
        handleCheckedChange(true, resourceId);
      } else {
        handleCheckedChange(false, resourceId);
      }
    }
  }, [isSelectAll, isParentChecked, resourceId])

  return (
    <div className="flex p-2 border-b content-center gap-2">
      <Checkbox disabled={isParentChecked === true} checked={isParentChecked || checked} onCheckedChange={(checkedState) => {
        setChecked(checkedState);
        handleCheckedChange(checkedState, info.resourceData.resource_id)
      }} className="self-center" />
      <FileIcon className="self-center" />
      <div className="text-xs">{name}</div>
    </div>
  )
}
