import { Dispatch, SetStateAction } from "react"

export type ConnectionInfo = {
  name: 'Gdrive connection' | string,
  connection_id: string,
  user_id: string,
  org_id: string,
  share_with_org: boolean,
  created_at: string,
  updated_at: string,
  connection_provider: "gdrive" | string,
  connection_provider_data: {
    access_token: string,
    refresh_token: string,
    scope: string,
    token_type: "Bearer" | string,
    can_be_knowledge_base: boolean,
  }

}
type DriveResourceBase = {
  knowledge_base_id: string,
  created_at: string,
  modified_at: string,
  indexed_at: unknown,
  resource_id: string,
  inode_path: { path: string },
  inode_id: unknown,
  content_hash: string,
  content_mime: string,
  size: number, // bit-size
  status: 'resource' | null, // looks like its a resource if its a file...may relate to with other types at stack-ai
}

export type DirectoryDriveResource = DriveResourceBase & {
  inode_type: "directory",
}
export type FileDriveResource = DriveResourceBase & {
  inode_type: "file",
}

export type DriveResource = DirectoryDriveResource | FileDriveResource;

export type ResourcesByDirectory = {
  resourceData: DriveResource,
  directoryEntries: {
    directories: Record<string, ResourcesByDirectory>,
    files: Record<string, { resourceData: DriveResource }>, // technically no resources directory and should update type
  },
}
export function isDirectory(driveResource: DriveResource): driveResource is DirectoryDriveResource {
  return driveResource.inode_type === "directory";
}

export type ResourcesView = FileDriveResource | DirectoryDriveResource & { directoryEntries: ResourcesView };

export type CheckedChangeHandler = ({ isParentChecked, checkedState, resourceId, setChecked }: { isParentChecked: string | boolean, checkedState: boolean | "indeterminate", resourceId: string, setChecked: Dispatch<SetStateAction<boolean>> }) => void;
