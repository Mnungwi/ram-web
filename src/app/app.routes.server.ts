import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'services/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'projects/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'news/:id',
    renderMode: RenderMode.Server
  },
  {
    // Live SSR on every request (fresh data from the admin-managed backend
    // each time) — NOT build-time Prerender. Prerender would bake in
    // whatever the DB looked like at build time and never update again,
    // which defeats the point of the admin CMS; it was also what caused
    // `ng build` to hang/time out trying to render data-fetching routes
    // (services, projects, news, etc.) inside its own build-time worker.
    path: '**',
    renderMode: RenderMode.Server
  }
];
