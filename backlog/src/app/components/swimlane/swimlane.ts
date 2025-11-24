import { Component, input } from '@angular/core';
import { SwimlaneModel } from '../../models/board.model';
import { WorkItemDisplay } from '../work-item-display/work-item-display';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-swimlane',
  imports: [WorkItemDisplay, DragDropModule],
  templateUrl: './swimlane.html',
  styleUrl: './swimlane.css',
})
export class Swimlane {
    model = input.required<SwimlaneModel>();

    onDrop(event: unknown) {
      console.log(event);
    }
}
