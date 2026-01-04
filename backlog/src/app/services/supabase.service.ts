import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "../environments/environment";
import { from, map, Observable } from "rxjs";
import { WorkItem, WorkItemCreate, WorkItemType } from "../models/board.model";

@Injectable({ providedIn: 'root' })
export class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(
            environment.supabaseUrl, 
            environment.supabaseKey,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: false, // TODO: Find a solution where this can be set to true
                    detectSessionInUrl: true,
                }
            }
        );
    }

    getWorkItemsById(projectId: number): Observable<WorkItem[]> {
        return from(
            this.client
                .from('workitems')
                .select('*')
                .eq('project_id', projectId)
                .order('order', { ascending: true })
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data || [];
            })
        );
    }

    createWorkItem(title: string, type: WorkItemType, projectId: number, order: number): Observable<WorkItem> {
        const workItem: WorkItemCreate = {
            title,
            project_id: projectId,
            order,
            status: 0,
            type
        }
        return from(
            this.client
                .from('workitems')
                .insert(workItem)
                .select()
                .single()
            ).pipe(
                map(({ data, error }) => {
                    if (error) throw error;
                    return data;
                })
            );
    }   

    updateWorkItem(workItem: WorkItem): Observable<WorkItem> {
        return from(
            this.client
                .from('workitems')
                .upsert(workItem)
                .select()
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data;
            })
        );
    }
}