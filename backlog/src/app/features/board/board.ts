import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ProjectStore } from '../../store/project.store';
import { Swimlane } from '../../components/swimlane/swimlane';
import { combineLatest, filter, take } from 'rxjs';
import { Spinner } from '../../components/spinner/spinner';
import { SwimlaneModel } from '../../models/board.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../../services/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { WorkItemDialog, WorkItemDialogData } from '../../components/work-item-dialog/work-item-dialog';

@Component({
  selector: 'app-board',
  imports: [Swimlane, Spinner, MatButtonModule, MatIconModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  readonly projectStore = inject(ProjectStore);
  readonly swimlanes: SwimlaneModel[] = [
    { name: 'New', workItems: [] },
    { name: 'In Progress', workItems: [] },
    { name: 'Done', workItems: [] }
  ];
  
  private readonly router = inject(Router);
  private readonly supabaseService = inject(SupabaseService);
  private readonly dialog = inject(MatDialog);
  private readonly DEFAULT_ORDER = 1000;

  private projectId?: number;

  constructor(route: ActivatedRoute) {
    this.projectStore.loadProjects();

    combineLatest([
      route.params,
      toObservable(this.projectStore.loaded)
    ]).pipe(
      takeUntilDestroyed(),
      filter(([_, loaded]) => loaded)
    ).subscribe(([params, _]) => {
      this.projectId = +params['projectId'];
      this.projectStore.setSelectedProject(this.projectId);
      this.supabaseService.getWorkItemsById(this.projectId).subscribe((res) => {
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
    }

    this.updateOrderAndSave(event.container.data, event.currentIndex);
  }

  openDialog() {
    const dialogRef = this.dialog.open<WorkItemDialog, void, WorkItemDialogData>(WorkItemDialog)

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.projectId) {
        const order = this.getNextOrder(this.swimlanes[0]);
        this.supabaseService.createWorkItem(result.title, result.type, this.projectId, order).pipe(take(1)).subscribe((workItem) => {
          this.swimlanes[workItem.status].workItems.push(workItem);
        })
      }
    });
  }

  toOverview() {
    this.router.navigate(['']);
  }

  private updateOrderAndSave(swimlane: SwimlaneModel, movedIndex: number) {
    const items = swimlane.workItems;
    const movedItem = items[movedIndex];
    
    const prevItem = items[movedIndex - 1];
    const nextItem = items[movedIndex + 1];
    
    if (!prevItem && !nextItem) {
      // Only item in swimlane
      movedItem.order = this.DEFAULT_ORDER;
    } else if (!prevItem) {
      // Moving to top
      movedItem.order = nextItem!.order - this.DEFAULT_ORDER;
    } else if (!nextItem) {
      // Moving to bottom
      movedItem.order = prevItem.order + this.DEFAULT_ORDER;
    } else {
      // Moving between items
      movedItem.order = prevItem.order + ((nextItem.order - prevItem.order) / 2);
    }
    
    // Check if we need to rebalance
    if (!Number.isInteger(movedItem.order) || movedItem.order < 0) {
      this.rebalanceOrders(swimlane);
      // Save all items after rebalance
      this.supabaseService.updateWorkItems(items).subscribe();
    } else {
      // Only save the moved item
      this.supabaseService.updateWorkItem(movedItem).subscribe();
    }
  }

  private rebalanceOrders(swimlane: SwimlaneModel) {
    swimlane.workItems.forEach((item, index) => {
      item.order = (index + 1) * this.DEFAULT_ORDER;
    });
  }

  private getNextOrder(swimlane: SwimlaneModel): number {
    const items = swimlane.workItems;
    if (items.length > 0) {
      return Math.max(...items.map(i => i.order)) + this.DEFAULT_ORDER;
    }
    return this.DEFAULT_ORDER;
  }
}