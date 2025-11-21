import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectCard } from '../../components/project-card/project-card';
import { GitHubService } from '../../services/github.service';
import { GitHubRepository } from '../../models/github.model';
import { catchError, of, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    githubService: GitHubService,
    snackBar: MatSnackBar
  ) {
    githubService
      .getAllRepos()
      .pipe(
        take(1),
        catchError((err) => {
          snackBar.open(
            'Github API call failed. Did you configure the PAT Token? 👀',
            'Close',
            { duration: 8000 }
          );
          console.error('GitHub error:', err);
          return of([]);
        })
      )
      .subscribe((repos) => (this.projectStore.setProjects(repos)));
  }

  openProject(project: GitHubRepository) {
    this.router.navigate(['board', project.id]);
  }
}
