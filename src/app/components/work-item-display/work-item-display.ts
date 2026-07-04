import { Component, input, output } from '@angular/core';
import { WorkItem, WorkItemType } from '../../models/board.model';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-work-item-display',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './work-item-display.html',
  styleUrl: './work-item-display.css',
})
export class WorkItemDisplay {
  readonly itemType = WorkItemType;

  item = input.required<WorkItem>();
  deleteItem = output<WorkItem>();
}
