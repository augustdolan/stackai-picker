import { getConnections } from "@/app/api/connections";
import { redirect } from "next/navigation";
// this component will expand to include a connection selector
export default async function Connections() {
  const [defaultGDriveConnection] = await getConnections();
  redirect(`/connections/${defaultGDriveConnection.connection_id}`);
}

