import { Component, input } from '@angular/core';
import { Project } from '../../models/project.model';
import { LanguageDisplay } from './language-display/language-display';

@Component({
  selector: 'app-project-card',
  imports: [LanguageDisplay],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  project = input.required<Project>()
}
