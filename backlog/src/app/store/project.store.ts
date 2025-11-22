import { GitHubRepository } from "../models/github.model";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

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
    }
  }))
);
