// import { auth } from "@/auth";
// import DriveResourceContainer from "@/components/DriveResourceContainer";
// import SignIn from "@/components/SignIn";
//
// export default async function Home() {
//   const session = await auth();
//   console.log("Hugh")
//   if (!session) {
//     return <SignIn />
//   } else {
//     return (
//       <main className="p-8 h-full flex flex-col justify-center">
//         <DriveResourceContainer />
//       </main>
//     );
//   }
// }
import { Card } from "@/components/ui/card";
import DriveResourceList from "@/components/DriveResourceList";
import { getAllDriveResources } from "@/app/api/googleDrive/getAll";
import { auth } from "@/auth";
export default async function DriveResourceContainer() {
  const session = await auth();
  const resources = session && await getAllDriveResources();
  return (
    <Card className="relative p-8 h-2/3">
      {resources && <DriveResourceList resources={resources} />}
    </Card>
  )
}

