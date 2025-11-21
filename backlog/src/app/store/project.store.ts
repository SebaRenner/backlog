import { computed } from "@angular/core";
import { GitHubRepository } from "../models/github.model";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

type ProjectState = {
  projects: GitHubRepository[];
};

const initialState: ProjectState = {
  projects: [],
};

export const ProjectStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store) => ({
    setProjects(projects: GitHubRepository[]) {
      patchState(store, { projects });
    },
    getById(id: number): GitHubRepository | undefined {
        return store.projects().find(p => p.id === id)
    }
  }))
);
