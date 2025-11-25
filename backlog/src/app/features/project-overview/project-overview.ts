import { Component, computed, inject } from '@angular/core';
import { ProjectCard } from '../../components/project-card/project-card';
import { GitHubRepository } from '../../models/github.model';
import { Router } from '@angular/router';
import { ProjectStore } from '../../store/project.store';
import { LoginStore } from '../../store/login.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-overview',
  imports: [ProjectCard, MatButtonModule, MatIconModule],
  templateUrl: './project-overview.html',
  styleUrl: './project-overview.css',
})
export class ProjectOverview {  
  private readonly router = inject(Router);
  private readonly projectStore = inject(ProjectStore);
  private readonly loginStore = inject(LoginStore);
  
  projects = computed(() => 
    [...this.projectStore.projects()]
      .sort((a, b) => b.updated_at > a.updated_at ? 1 : -1)
  );

  constructor() {
    this.projectStore.loadProjects();
  }

  openProject(project: GitHubRepository) {
    this.router.navigate(['board', project.id]);
  }

  logout() {
    this.loginStore.logout();
    this.router.navigate(['login']);
  }
}
