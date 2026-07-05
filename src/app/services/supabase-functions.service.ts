import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { GitHubRepository } from '../models/github.model';

@Injectable({ providedIn: 'root' })
export class SupabaseFunctionsService {
  private readonly client = inject(SupabaseService).client;

  login(password: string): Observable<boolean> {
    return from(
      this.client.functions.invoke('backlog-api/auth/validate', { body: { password } }),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data.valid as boolean;
      }),
    );
  }

  getAllRepos(pageSize: number, page: number): Observable<GitHubRepository[]> {
    const endpoint = `backlog-api/github/repos?per_page=${pageSize}&page=${page}`;
    return from(this.client.functions.invoke(endpoint, { method: 'GET' })).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as GitHubRepository[];
      }),
    );
  }
}
