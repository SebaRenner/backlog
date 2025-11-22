import { Component, input } from '@angular/core';

@Component({
  selector: 'app-swimlane',
  imports: [],
  templateUrl: './swimlane.html',
  styleUrl: './swimlane.css',
})
export class Swimlane {
    name = input.required<string>();
}
