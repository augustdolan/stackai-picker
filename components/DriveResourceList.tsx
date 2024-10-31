"use client"
import { Label } from "@/components/ui/label"
import { ResourcesByDirectory } from "@/app/api/googleDrive/getAll";
import { DriveDirectory } from "./DriveDirectory";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { CheckedChangeHandler } from "@/types/googleDrive";
import { Button } from "./ui/button";
import { syncToKnowledgeBase } from "@/app/api/googleDrive/syncToKnowledgeBase";
import GoogleDriveIcon from "./ui/GoogleDriveIcon";

export default function DriveResourceList({ resources }: { resources: ResourcesByDirectory }) {
  const [checked, setChecked] = useState(false)
  const [selectedResources, setSelectedResources] = useState(new Set<string>());
  console.log(selectedResources);
  const handleCheckedChange: CheckedChangeHandler = (checkedState, resourceId) => {
    if (checkedState === true) {
      setSelectedResources(prev => {
        const selectedResourcesCopy = new Set(prev);
        selectedResourcesCopy.add(resourceId);
        return selectedResourcesCopy
      })
    } else {
      setSelectedResources(prev => {
        const selectedResourcesCopy = new Set(prev);
        selectedResourcesCopy.delete(resourceId);
        return selectedResourcesCopy
      })
    }

  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex pb-4 border-b gap-2 mb-8">
        <GoogleDriveIcon />
        <h1 className="font-bold text-lg">Google Drive</h1>
        <div className="bg-secondary px-2 text-lg rounded">Beta</div>
      </div>
      <div className="flex flex-col h-full overflow-auto">
        <div className="flex justify-between border-b pb-1">
          <div className="flex gap-2">
            <Checkbox onCheckedChange={((checkedState) => {
              const allResources = new Set<string>()
              if (checkedState === true) {
                Object.values(resources.directoryEntries).forEach((resource) => {
                  allResources.add(resource.resourceData.resource_id)
                })
              }
              setChecked(checkedState === true);
              // if checked state not true, set an empty set
              setSelectedResources(allResources);
            })} id="select-all" />
            <Label htmlFor="select-all">Select all</Label>
          </div>
          <div className="text-zinc-400">{selectedResources.size}</div>
        </div>
        <div>
          <div className="h-full flex flex-col gap-4">
            <ul className="flex flex-col">
              <DriveDirectory isParentChecked={checked} name={"Google Drive"} info={resources} handleCheckedChange={handleCheckedChange} />
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t w-full pt-2 flex justify-end">
        <Button disabled={selectedResources.size === 0} onClick={() => { syncToKnowledgeBase(selectedResources) }}>Sync {selectedResources.size}</Button>
      </div>
    </div>
  )
}
