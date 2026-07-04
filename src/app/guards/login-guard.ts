import { CanActivateFn, Router } from '@angular/router';
import { LoginStore } from '../store/login.store';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const loginStore = inject(LoginStore);
  const router = inject(Router);

  return loginStore.loggedIn()
    ? true
    : router.createUrlTree(['/login']);
};
