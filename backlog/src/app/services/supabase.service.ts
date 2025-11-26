import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    async getWorkItemsById(projectId: number) {
        const { data, error } = await this.client
            .from('workitems')
            .select('*')
            .eq('project_id', projectId);

        if (error) {
            console.error('Error fetching work items:', error);
            throw error;
        }

        return data;
    }
}