import { getRootResources } from "@/app/api/googleDriveResources";
import ConnectionResourceList from "@/components/connections/ConnectionResourceList";
import Directory from "@/components/connections/Directory";
import RootDirectory from "@/components/connections/RootDirectory";
import { Card } from "@/components/ui/card";

export default async function Connection({ params }: { params: { connectionId: string } }) {
  // assuming the backend normalizes different connection representations
  return (
    <main className="p-8 h-full flex flex-col justify-center">
      <Card className="relative p-8 h-2/3">
        <ConnectionResourceList>
          <RootDirectory connectionId={params.connectionId} />
        </ConnectionResourceList>
      </Card>
    </ main>
  )
}
