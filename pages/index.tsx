import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <main className="p-8">
      <div className="flex pb-4 border-b gap-2 mb-8">
        <h1 className="font-bold text-lg">Google Drive</h1>
        <div className="bg-secondary px-2 text-lg rounded">Beta</div>
      </div>
      <div className="flex justify-between border-b pb-1">
        <div className="flex gap-2">
          <Checkbox id="select-all" />
          <Label htmlFor="select-all">Select all</Label>
        </div>
        <div className="text-zinc-400">{count}</div>
      </div>
    </main>
  );
}
