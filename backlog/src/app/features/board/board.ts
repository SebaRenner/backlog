import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ProjectStore } from '../../store/project.store';
import { Swimlane } from '../../components/swimlane/swimlane';
import { combineLatest, filter } from 'rxjs';
import { Spinner } from '../../components/spinner/spinner';
import { SwimlaneModel } from '../../models/board.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-board',
  imports: [Swimlane, Spinner, MatButtonModule, MatIconModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  readonly projectStore = inject(ProjectStore);
  readonly swimlanes: SwimlaneModel[] = [{
    name: 'New',
    workItems: []
  },
  {
    name: 'In Progress',
    workItems: []
  },
  {
    name: 'Done',
    workItems: []
  }];
  
  private readonly router = inject(Router);
  private readonly supabaseService = inject(SupabaseService);

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
      this.supabaseService.getWorkItemsById(+projectId).subscribe((res) => {
        res.map((workItem) => {
          this.swimlanes[workItem.status].workItems.push(workItem);
        })
      });
    });
  }

  getConnectedLanes(currentIndex: number): string[] {
    return this.swimlanes
      .map((_, index) => `lane-${index}`)
      .filter((_, index) => index !== currentIndex);
  }

  onDrop(event: CdkDragDrop<SwimlaneModel>, newLaneIndex: number) {
    if (event.previousContainer === event.container) {
      // Reorder within the same swimlane
      moveItemInArray(
        event.container.data.workItems,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Transfer between swimlanes
      transferArrayItem(
        event.previousContainer.data.workItems,
        event.container.data.workItems,
        event.previousIndex,
        event.currentIndex
      );
      
      const movedWorkItem = event.container.data.workItems[event.currentIndex];
      movedWorkItem.status = newLaneIndex;

      this.supabaseService.saveWorkItem(movedWorkItem).subscribe();
    }
  }

  toOverview() {
    this.router.navigate(['']);
  }
}