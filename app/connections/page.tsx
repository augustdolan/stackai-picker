import { getConnections } from "@/app/api/connections";
import { redirect } from "next/navigation";
// this component will expand to include a connection selector
export default async function Connections() {
  const defaultGDriveConnections = await getConnections();
  const connectionId = defaultGDriveConnections[0]?.connection_id;
  redirect(`/connections/${connectionId}`);
}

