import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectCard } from '../../components/project-card/project-card';
import { GitHubService } from '../../services/github.service';
import { GitHubRepository } from '../../models/github.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-project-overview',
  imports: [MatButtonModule, MatIconModule, ProjectCard],
  templateUrl: './project-overview.html',
  styleUrl: './project-overview.css',
})
export class ProjectOverview {
    projects: GitHubRepository[] = [];

    constructor(githubService: GitHubService) {
      githubService.getAllRepos().pipe(take((1))).subscribe((repos => this.projects = repos));
    }
}
