import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type LoginState = {
    loggedIn: boolean;
}

const initialState: LoginState = {
    loggedIn: false,
}

export const LoginStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    login() {
        patchState(store, { loggedIn: true })
    },
    logout() {
        patchState(store, { loggedIn: false })
    }
  }))    
)
