import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { CachingService } from "../services/caching.service";

export type LoginState = {
    loggedIn: boolean;
}

const initialState: LoginState = {
    loggedIn: false,
}

export const LoginStore = signalStore(
  { providedIn: 'root' },
  withState(() => {
    const cachingService = inject(CachingService);
    return cachingService.getLoginState() ?? initialState;
  }),
  withMethods((store, cachingService = inject(CachingService)) => ({
    login() {
        const state: LoginState = { loggedIn: true };
        patchState(store, state)
        cachingService.saveLoginState(state)
    },
    logout() {
        const state: LoginState = { loggedIn: false };
        patchState(store, state)
        cachingService.saveLoginState(state);
    }
  }))    
)
