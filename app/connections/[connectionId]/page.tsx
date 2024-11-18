import ConnectionResourceList from "@/components/connections/ConnectionResourceList";
import RootDirectory from "@/components/connections/RootDirectory";
import { Card } from "@/components/ui/card";

export default async function Connection({ params }: { params: Promise<{ connectionId: string }> }) {
  // assuming the backend normalizes different connection representations
  const { connectionId } = await params;
  return (
    <main className="p-8 h-full flex flex-col justify-center">
      <Card className="relative p-8 h-2/3">
        <ConnectionResourceList>
          <RootDirectory connectionId={connectionId} />
        </ConnectionResourceList>
      </Card>
    </ main>
  )
}
