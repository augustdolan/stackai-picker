import { useQuery } from "@tanstack/react-query";

// DO NOT COMMIT UNTIL THESE ARE IN ENV VARIABLES OR SOMETHING
export default function DriveDocumentList() {
  console.log(process.env.NEXT_PUBLIC_ANON_KEY)
  return <div>DriveDocumentList</div>
}
