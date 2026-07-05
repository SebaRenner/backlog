import { inject, Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';
import { GitHubRepository } from '../models/github.model';
import { SupabaseFunctionsService } from './supabase-functions.service';

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private readonly pageSize = 100;
  private readonly functionsService = inject(SupabaseFunctionsService);

  getAllRepos(): Observable<GitHubRepository[]> {
    return this.functionsService.getAllRepos(this.pageSize, 1).pipe(
      expand((repos, index) =>
        repos.length === this.pageSize
          ? this.functionsService.getAllRepos(this.pageSize, index + 2)
          : EMPTY,
      ),
      reduce((all, repos) => all.concat(repos), [] as GitHubRepository[]),
    );
  }
}
