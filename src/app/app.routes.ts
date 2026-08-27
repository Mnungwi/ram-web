import { Routes } from '@angular/router';
import { careersGuard } from './core/guards/careers.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
      { path: 'services', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent) },
      { path: 'services/:id', loadComponent: () => import('./pages/services/service-detail/service-detail.component').then(m => m.ServiceDetailComponent) },
      { path: 'projects', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'projects/:id', loadComponent: () => import('./pages/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
      { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent) },
      { path: 'news', loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent) },
      { path: 'news/:id', loadComponent: () => import('./pages/news/news-detail/news-detail.component').then(m => m.NewsDetailComponent) },
      { path: 'careers', loadComponent: () => import('./pages/careers/careers.component').then(m => m.CareersComponent), canActivate: [careersGuard] },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
    ]
  },
  // NOTE: the website used to also embed its own mini admin CMS at /admin
  // (own localStorage-token login, no shared AuthService/interceptor). It
  // duplicated the real admin app's Website Manager modules and was removed
  // as a redundant/insecure surface — manage all website content from the
  // real admin app instead.
  { path: '**', redirectTo: '' }
];
