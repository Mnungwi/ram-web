import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { PublicApiService } from '../services/public-api.service';

// Blocks direct/bookmarked access to /careers whenever there are no active
// job vacancies — the nav link is also hidden in this case (see
// MainLayoutComponent), but a guard is needed so the page itself can't be
// reached by typing the URL directly.
export const careersGuard: CanActivateFn = () => {
  const apiSvc = inject(PublicApiService);
  const router = inject(Router);

  return apiSvc.getCareers().pipe(
    map((res) => {
      const hasActiveJobs = !!(res?.success && res?.data && res.data.length > 0);
      return hasActiveJobs ? true : router.createUrlTree(['/']);
    }),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
