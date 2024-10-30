import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { auth } from "@/auth"
import { stackAiFetch } from "./api/stackai";

export default async function Home() {
  const session = await auth();
  const connections = await stackAiFetch("connections?connection_provider=gdrive&limit1")
  const allResources = await stackAiFetch(`connections/${connections[0].connection_id}/resources/children`)
  const file = "1GYpHUOiSYXGz_9GeUGgQkwQUJqCAxibGd9szwMJQSIg";
  const url = `connections/${connections[0].connection_id}/resources?resource_id=${file}`
  const info = await stackAiFetch(url)
  // console.log("Connections!", allResources)
  // console.log("url", url);
  // console.log("INFO!", info)
  // const [count, setCount] = useState(0);
  return (
    <main className="p-8">
      <div className="flex pb-4 border-b gap-2 mb-8">
        <h1 className="font-bold text-lg">Google Drive</h1>
        <div className="bg-secondary px-2 text-lg rounded">Beta</div>
      </div>
      <div className="flex justify-between border-b pb-1">
        <div className="flex gap-2">
          <div>{session?.orgId}</div>
          <Checkbox id="select-all" />
          <Label htmlFor="select-all">become client</Label>
        </div>
        <div className="text-zinc-400">0</div>
      </div>
    </main>
  );
}

