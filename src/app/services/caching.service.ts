import { Injectable } from "@angular/core";
import { LoginState } from "../store/login.store";

@Injectable({ providedIn: 'root' })
export class CachingService {
    private readonly STORAGE_KEY = 'login_state';

    saveLoginState(state: LoginState) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    }

    getLoginState(): LoginState | null {
        const cache = localStorage.getItem(this.STORAGE_KEY);
        return cache ? JSON.parse(cache) : null
    }
}