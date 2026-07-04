import { Component, input } from '@angular/core';
import { LanguageDisplay } from './language-display/language-display';
import { GitHubRepository } from '../../models/github.model';

@Component({
  selector: 'app-project-card',
  imports: [LanguageDisplay],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  project = input.required<GitHubRepository>()
}
