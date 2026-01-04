import { Component, inject, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkItemType } from '../../models/board.model';
import { MatSelectModule } from '@angular/material/select';

export interface WorkItemDialogData {
  title: string; 
  type: WorkItemType
}

@Component({
  selector: 'app-work-item-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './work-item-dialog.html',
  styleUrl: './work-item-dialog.css',
})
export class WorkItemDialog {
  readonly typeOptions = [
    { value: WorkItemType.Bug, label: 'Bug' },
    { value: WorkItemType.Feature, label: 'Feature' },
  ];

  private fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    type: [WorkItemType.Feature, Validators.required]
  });
}