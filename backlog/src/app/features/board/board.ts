import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GitHubRepository } from '../../models/github.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectStore } from '../../store/project.store';
import { Swimlane } from '../../components/swimlane/swimlane';

@Component({
  selector: 'app-board',
  imports: [Swimlane],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  project: GitHubRepository | undefined;

  readonly swimlanes = ['New', 'Next Up', 'In Progress', 'Review', 'Done'];

  private readonly projectStore = inject(ProjectStore);

  constructor(route: ActivatedRoute) {
    route.params.pipe(takeUntilDestroyed()).subscribe((params) => {
      const projectId = params['projectId'];
      this.project = this.projectStore.projects().find(p => p.id == projectId);
    })
  }
}
