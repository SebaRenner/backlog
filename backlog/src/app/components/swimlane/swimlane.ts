import { Component, input } from '@angular/core';
import { SwimlaneModel } from '../../models/board.model';
import { WorkItemDisplay } from '../work-item-display/work-item-display';

@Component({
  selector: 'app-swimlane',
  imports: [WorkItemDisplay],
  templateUrl: './swimlane.html',
  styleUrl: './swimlane.css',
})
export class Swimlane {
    model = input.required<SwimlaneModel>();
}
