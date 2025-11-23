import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ProjectStore } from '../../store/project.store';
import { Swimlane } from '../../components/swimlane/swimlane';
import { combineLatest, filter } from 'rxjs';

@Component({
  selector: 'app-board',
  imports: [Swimlane],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  readonly swimlanes = ['New', 'Next Up', 'In Progress', 'Review', 'Done'];
  readonly projectStore = inject(ProjectStore);

  constructor(route: ActivatedRoute) {
    this.projectStore.loadProjects();
    
    combineLatest([
      route.params,
      toObservable(this.projectStore.loaded)
    ]).pipe(
      takeUntilDestroyed(),
      filter(([_, loaded]) => loaded)
    ).subscribe(([params, _]) => {
      const projectId = params['projectId'];
      this.projectStore.setSelectedProject(+projectId);
    });
  }
}
