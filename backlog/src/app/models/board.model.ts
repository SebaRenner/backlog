export interface SwimlaneModel {
    name: string;
    workItems: WorkItem[];
}

export interface WorkItem {
    title: string;
    type: WorkItemType;
}

export enum WorkItemType {
    Bug,
    Feature,
}