export interface SwimlaneModel {
    name: string;
    workItems: WorkItem[];
}

export interface WorkItem {
    id: number;
    title: string;
    type: WorkItemType;
    swimlane: number;
    project_id: number;  // TODO: Split off database model from app model
}

export enum WorkItemType {
    Bug,
    Feature,
}