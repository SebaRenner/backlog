import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectCard } from '../../components/project-card/project-card';
import { GitHubRepository } from '../../models/github.model';
import { Router } from '@angular/router';
import { ProjectStore } from '../../store/project.store';

@Component({
  selector: 'app-project-overview',
  imports: [MatButtonModule, MatIconModule, ProjectCard],
  templateUrl: './project-overview.html',
  styleUrl: './project-overview.css',
})
export class ProjectOverview {  
  private readonly router = inject(Router);
  private readonly projectStore = inject(ProjectStore);
  
  projects = this.projectStore.projects;

  constructor() {
    this.projectStore.loadProjects();
  }

  openProject(project: GitHubRepository) {
    this.router.navigate(['board', project.id]);
  }
}
