import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectCard } from '../../components/project-card/project-card';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-overview',
  imports: [MatButtonModule, MatIconModule, ProjectCard],
  templateUrl: './project-overview.html',
  styleUrl: './project-overview.css',
})
export class ProjectOverview {
    projects: Project[] = [{
      name: 'ngx-interceptors',
      language: 'TypeScript',
      description: 'Library with common HTTP Interceptors for Angular Applications'
    }, 
    {
      name: 'quantum-random',
      language: 'Q#',
      description: 'Simple stupid random number generator using Q#.'
    }];
}
