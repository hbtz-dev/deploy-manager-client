
export const MANAGE_LOCATION = import.meta.env.VITE_MANAGER_LOCATION ?? "" as string;

export type ProjectStatus = "ok" | "terminated" | "starting" | "stopping" | "failed" | "crashed" | "killed";
export type ManagedItem = {
    name: string;
    repo: string;
    install?: string;
    build?: string;
    start: string;
    env?: Record<string, string>;
    proxy?: { fromHost: string; toPort: number; };
};
export type ManagerReport = { name: string; status: ProjectStatus; detail: string; data: ManagedItem; };
export type ServerInit = ManagerReport[];

export type Action = "start" | "stop" | "restart" | "eradicate" | "kill";
export type ActionSchema = { type: Action; which: string; };
