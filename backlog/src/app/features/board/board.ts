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

          Object.values(this.swimlanes).forEach(swimlane => {
            swimlane.workItems.sort((a, b) => a.order - b.order);
          });
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
      this.updateOrderAndSave(event.container.data, event.currentIndex);
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
      this.updateOrderAndSave(event.container.data, event.currentIndex);
    }
  }

  toOverview() {
    this.router.navigate(['']);
  }

  private updateOrderAndSave(swimlane: SwimlaneModel, movedIndex: number) {
    const items = swimlane.workItems;
    const movedItem = items[movedIndex];
    
    const prevItem = movedIndex > 0 ? items[movedIndex - 1] : null;
    const nextItem = movedIndex < items.length - 1 ? items[movedIndex + 1] : null;
    
    if (!prevItem && !nextItem) {
      // Only item in swimlane
      movedItem.order = 1000;
    } else if (!prevItem) {
      // Moving to top
      movedItem.order = nextItem!.order - 1000;
    } else if (!nextItem) {
      // Moving to bottom
      movedItem.order = prevItem.order + 1000;
    } else {
      // Moving between items
      movedItem.order = prevItem.order + ((nextItem.order - prevItem.order) / 2);
    }
    
    // Check if we need to rebalance
    if (!Number.isInteger(movedItem.order) || movedItem.order < 0) {
      this.rebalanceOrders(swimlane);
      // Save all items after rebalance
      items.forEach(item => {
        this.supabaseService.saveWorkItem(item).subscribe();
      });
    } else {
      // Only save the moved item
      this.supabaseService.saveWorkItem(movedItem).subscribe();
    }
  }

  private rebalanceOrders(swimlane: SwimlaneModel) {
    swimlane.workItems.forEach((item, index) => {
      item.order = (index + 1) * 1000;
    });
  }
}