import { Component, input, output } from '@angular/core';
import { SwimlaneModel, WorkItem } from '../../models/board.model';
import { WorkItemDisplay } from '../work-item-display/work-item-display';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-swimlane',
  imports: [WorkItemDisplay, DragDropModule],
  templateUrl: './swimlane.html',
  styleUrl: './swimlane.css',
})
export class Swimlane {
    lane = input.required<SwimlaneModel>();
    laneId = input.required<string>();
    connectedTo = input<string[]>([]);
    drop = output<CdkDragDrop<SwimlaneModel>>();
    deleteItem = output<WorkItem>();

    onDrop(event: CdkDragDrop<SwimlaneModel>) {
      this.drop.emit(event);
    }
}