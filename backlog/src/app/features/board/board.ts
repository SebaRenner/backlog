import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ProjectStore } from '../../store/project.store';
import { Swimlane } from '../../components/swimlane/swimlane';
import { combineLatest, filter } from 'rxjs';
import { Spinner } from '../../components/spinner/spinner';
import { SwimlaneModel, WorkItemType } from '../../models/board.model';

@Component({
  selector: 'app-board',
  imports: [Swimlane, Spinner],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  readonly swimlanes: SwimlaneModel[] = [{
    name: 'New',
    workItems: [{
      title: 'Add workitem component',
      type: WorkItemType.Feature
    },
    {
      title: 'Test Bug',
      type: WorkItemType.Bug
    }]},
  {
    name: 'In Progress',
    workItems: []
  },
  {
    name: 'Done',
    workItems: []
  }];
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
