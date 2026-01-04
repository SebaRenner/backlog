export interface SwimlaneModel {
    name: string;
    workItems: WorkItem[];
}

export interface WorkItem {
    id: number;
    title: string;
    type: WorkItemType;
    status: number;
    project_id: number;  // TODO: Split off database model from app model
    order: number;
}

export type WorkItemCreate = Omit<WorkItem, 'id'>;

export enum WorkItemType {
    Bug,
    Feature,
}