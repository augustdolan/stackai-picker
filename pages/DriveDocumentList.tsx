import { useQuery } from "@tanstack/react-query";

// DO NOT COMMIT UNTIL THESE ARE IN ENV VARIABLES OR SOMETHING
export async function fetchHeaders() {
}
export default function DriveDocumentList() {
  const { data } = useQuery({ queryKey: ['headers'], queryFn: fetchHeaders, })
  console.log(data, "data");
  return <div>DriveDocumentList</div>
}
