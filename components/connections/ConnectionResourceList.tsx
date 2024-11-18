"use client"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import GoogleDriveIcon from "@/components/ui/GoogleDriveIcon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/sonner";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

import { useState, useEffect, useOptimistic, } from "react";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";
import { useParams } from "next/navigation";

import { CheckedChangeHandler } from "@/types/googleDrive";
import { updateKnowledgeBase } from "@/app/api/knowledgeBases";
import { CheckedChangeContext, IsSelectAll, OptimisticIsSyncing, ShouldReset } from "@/context";


export default function ConnectionResourceList({ children }: { children: React.ReactNode }) {
  const { connectionId } = useParams();
  if (!connectionId || Array.isArray(connectionId)) {
    throw new Error("component unrenderable at path, please contact support regarding this bug");
  }
  const [shouldReset, setShouldReset] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [optimisticIsSyncing, addOptimisicIsSyncing] = useOptimistic(false, () => {
    return true;
  });
  const [wasSyncing, setWasSyncing] = useState(false);
  useEffect(() => {
    if (shouldReset && !optimisticIsSyncing) {
      setIsSelectAll(false);
      setShouldReset(false);
    }

    if (optimisticIsSyncing) {
      setWasSyncing(true);
    }

    if (!optimisticIsSyncing && wasSyncing) {
      toast("Success!", {
        description: "knowledge base created",
      })
      setShouldReset(true);
      setWasSyncing(false);
    }
  }, [shouldReset, optimisticIsSyncing]);
  const [selectedResources, setSelectedResources] = useState(new Set<string>());
  console.log(selectedResources);
  const checkedChangeHandler: CheckedChangeHandler = ({ isParentChecked, checkedState, resourceId, setChecked }) => {
    setChecked(Boolean(checkedState)); // force indeterminate to be true
    setSelectedResources((prev) => {
      if (!isParentChecked && checkedState) {
        return new Set(prev.add(resourceId));
      } else {
        prev.delete(resourceId);
        return new Set(prev);
      }
    })
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
            <Checkbox checked={isSelectAll} onCheckedChange={(checked) => {
              setIsSelectAll(Boolean(checked));
              if (!checked) {
                setShouldReset(true);
              }
            }} id="select-all" />
            <Label htmlFor="select-all">Select all</Label>
          </div>
          <div className="text-zinc-400">{selectedResources.size}</div>
        </div>
        <div>
          <div className="h-full flex flex-col gap-4">
            <form
              id="kbSyncForm"
              action={async () => {
                addOptimisicIsSyncing(true);
                try {
                  // synced and updated kb resources would be returned here, and then a light gray text would say "Indexed" for indexed ones
                  await updateKnowledgeBase({ selectedResources, connectionId })
                } catch (error) {
                  if (error instanceof Error) {
                    toast("Error!", {
                      description: error.message,
                    })
                  } else {
                    toast("Error!", {
                      description: "An error occurred",
                    })
                  }
                }
              }}
            >
              <Accordion type="single">
                <AccordionItem value="Root Accordion">
                  <OptimisticIsSyncing.Provider value={optimisticIsSyncing}>
                    <CheckedChangeContext.Provider value={checkedChangeHandler}>
                      <ShouldReset.Provider value={shouldReset}>
                        <IsSelectAll.Provider value={isSelectAll}>
                          {children}
                        </IsSelectAll.Provider>
                      </ShouldReset.Provider>
                    </CheckedChangeContext.Provider>
                  </OptimisticIsSyncing.Provider>
                </AccordionItem>
              </Accordion>
            </form>
          </div>
        </div>
      </div>
      { /* below is footer and should be separated into a new component */}
      <div className="border-t w-full pt-2 flex justify-end">
        <Toaster />
        <div className="flex gap-2">
          <Alert className="h-10 flex gap-2 bg-slate-100">
            <div><InfoIcon className="h-4 w-4" /></div>
            <AlertDescription className="self-center">
              We recommend selecting as few items as needed.
            </AlertDescription></Alert>
          <Button
            type="submit"
            form="kbSyncForm"
            disabled={selectedResources.size === 0 || optimisticIsSyncing}
          >{optimisticIsSyncing ? "Syncing" : "Sync"} {selectedResources.size}</Button>
        </div>
      </div>
    </div>
  )
}

