"use client"
import { Label } from "@/components/ui/label"
import { DriveDirectory } from "./DriveDirectory";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { CheckedChangeHandler, ResourcesByDirectory } from "@/types/googleDrive";
import { Button } from "./ui/button";
import { syncToKnowledgeBase } from "@/app/api/googleDrive/syncToKnowledgeBase";
import GoogleDriveIcon from "./ui/GoogleDriveIcon";
import { Alert, AlertDescription } from "./ui/alert";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

export default function DriveResourceList({ resources }: { resources: ResourcesByDirectory }) {
  const [checked, setChecked] = useState(false)
  const [selectedResources, setSelectedResources] = useState(new Set<string>());
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

  function selectAllHandler(checkedState: string | boolean) {
    const allResources = new Set<string>()
    if (checkedState === true) {
      Object.values<ResourcesByDirectory>(resources.directoryEntries).forEach((resource) => {
        allResources.add(resource.resourceData.resource_id)
      })
    }
    setChecked(checkedState === true);
    // if checked state not true, set an empty set
    setSelectedResources(allResources);
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
            <Checkbox onCheckedChange={selectAllHandler} id="select-all" />
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
        <Toaster />
        <div className="flex gap-2">
          <Alert className="h-10 flex gap-2 bg-slate-100">
            <div><InfoIcon className="h-4 w-4" /></div>
            <AlertDescription className="self-center">
              We recommend selecting as few items as needed.
            </AlertDescription></Alert>
          <Button disabled={selectedResources.size === 0} onClick={() => {
            setSelectedResources(new Set<string>())
            syncToKnowledgeBase(selectedResources)
            toast("Success!", {
              description: "knowledge base created",
            })
            // this is not hooked into if there is an error unfortunately
          }}>Sync {selectedResources.size}</Button>

        </div>
      </div>
    </div>
  )
}
