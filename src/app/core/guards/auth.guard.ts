import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (typeof window === 'undefined') {
    return true; // Allow SSR rendering, client-side will execute actual check
  }

  const token = localStorage.getItem('adminToken');
  if (token) {
    return true;
  }
  
  // Redirect to login if not logged in
  router.navigate(['/admin/login']);
  return false;
};
