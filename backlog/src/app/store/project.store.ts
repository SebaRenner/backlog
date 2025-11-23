import { inject } from "@angular/core";
import { GitHubRepository } from "../models/github.model";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap, catchError, of, filter } from "rxjs";
import { GitHubService } from "../services/github.service";
import { MatSnackBar } from "@angular/material/snack-bar";

type ProjectState = {
  projects: GitHubRepository[];
  selectedProject: GitHubRepository | undefined;
  loading: boolean;
  loaded: boolean;
};

const initialState: ProjectState = {
  projects: [],
  selectedProject: undefined,
  loading: false,
  loaded: false,
};

export const ProjectStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store, githubService = inject(GitHubService), snackBar = inject(MatSnackBar)) => ({
    setProjects(projects: GitHubRepository[]) {
      patchState(store, { projects, loaded: true, loading: false });
    },
    setSelectedProject(projectId: number) {
      patchState(store, { 
        selectedProject: store.projects().find(p => p.id === projectId) 
      });
    },
    
    loadProjects: rxMethod<void>(
      pipe(
        filter(() => !store.loaded() && !store.loading()),
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          githubService.getAllRepos().pipe(
            tap((repos) => {
              patchState(store, { 
                projects: repos, 
                loaded: true, 
                loading: false 
              });
            }),
            catchError((err) => {
              snackBar.open(
                'Github API call failed. Did you configure the PAT Token? 👀',
                'Close',
                { duration: 8000 }
              );
              console.error('GitHub error:', err);
              patchState(store, { loading: false });
              return of([]);
            })
          )
        )
      )
    )
  }))
);