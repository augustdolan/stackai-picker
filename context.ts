import { createContext } from "react";
import { CheckedChangeHandler } from "@/types/googleDrive";

export const CheckedChangeContext = createContext<CheckedChangeHandler | (() => void)>(() => { });
export const ShouldReset = createContext<boolean>(false);
export const IsSelectAll = createContext<boolean>(false);
