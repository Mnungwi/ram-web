import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
      { path: 'careers', loadComponent: () => import('./pages/careers/careers.component').then(m => m.CareersComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent) },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
      { path: 'projects', loadComponent: () => import('./pages/admin/projects/projects.component').then(m => m.AdminProjectsComponent), canActivate: [authGuard] },
      { path: 'services', loadComponent: () => import('./pages/admin/services/services.component').then(m => m.AdminServicesComponent), canActivate: [authGuard] },
      { path: 'news', loadComponent: () => import('./pages/admin/news/news.component').then(m => m.AdminNewsComponent), canActivate: [authGuard] },
      { path: 'gallery', loadComponent: () => import('./pages/admin/gallery/gallery.component').then(m => m.AdminGalleryComponent), canActivate: [authGuard] }
    ]
  },
  { path: '**', redirectTo: '' }
];
