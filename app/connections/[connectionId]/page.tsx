import ConnectionResourceList from "@/components/connections/ConnectionResourceList";
import Directory from "@/components/connections/Directory";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Connection({ params }: { params: Promise<{ connectionId: string }> }) {
  // assuming the backend normalizes different connection representations
  const { connectionId } = await params;
  return (
    <main className="p-8 h-full flex flex-col justify-center">
      <Card className="relative p-8 h-2/3">
        <ConnectionResourceList>
          <Suspense fallback={<Skeleton className="h-4 w-50% m-2" />}>
            <Directory connectionId={connectionId} isRoot={true} />
          </Suspense>
        </ConnectionResourceList>
      </Card>
    </ main>
  )
}
