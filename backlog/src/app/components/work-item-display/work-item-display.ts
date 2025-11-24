import { Component, input } from '@angular/core';
import { WorkItem, WorkItemType } from '../../models/board.model';

@Component({
  selector: 'app-work-item-display',
  imports: [],
  templateUrl: './work-item-display.html',
  styleUrl: './work-item-display.css',
})
export class WorkItemDisplay {
  readonly itemType = WorkItemType;

  item = input.required<WorkItem>();
}
