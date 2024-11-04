import { getAllDriveResources as getAllConnectionResources } from "@/app/api/googleDriveResources";
import ConnectionResourceList from "@/components/connections/ConnectionResourceList";
import { Card } from "@/components/ui/card";

export default async function Connection({ params }: { params: { connectionId: string } }) {
  // assuming the backend normalizes different connection representations
  const resources = await getAllConnectionResources(params.connectionId);
  return (
    <main className="p-8 h-full flex flex-col justify-center">
      <Card className="relative p-8 h-2/3">
        {resources && <ConnectionResourceList resources={resources} />}
      </Card>
    </ main>
  )
}
