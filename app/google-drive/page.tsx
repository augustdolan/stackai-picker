import { Card } from "@/components/ui/card";
import DriveResourceList from "@/components/DriveResourceList";
import { getAllDriveResources } from "@/app/api/googleDriveResources";
import { auth } from "@/auth";
export default async function DriveResourceContainer() {
  const session = await auth();
  const resources = session && await getAllDriveResources();
  return (
    <main className="p-8 h-full flex flex-col justify-center">
      <Card className="relative p-8 h-2/3">
        {resources && <DriveResourceList resources={resources} />}
      </Card>
    </ main>
  )
}

