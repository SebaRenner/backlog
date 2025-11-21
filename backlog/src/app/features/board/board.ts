import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GitHubRepository } from '../../models/github.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectStore } from '../../store/project.store';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  project: GitHubRepository | undefined;

  private readonly projectStore = inject(ProjectStore);

  constructor(route: ActivatedRoute) {
    route.params.pipe(takeUntilDestroyed()).subscribe((params) => {
      const projectId = params['projectId'];
      this.project = this.projectStore.projects().find(p => p.id == projectId);
    })
  }
}
