import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard fade-in-page">
      <div class="row mb-4">
        <div class="col-lg-3 col-6 mb-3">
          <div class="card p-3 border shadow-sm bg-white h-100">
            <h6 class="text-secondary small fw-bold text-uppercase">Public Projects</h6>
            <div class="display-5 fw-bold text-dark mt-2">12</div>
          </div>
        </div>
        <div class="col-lg-3 col-6 mb-3">
          <div class="card p-3 border shadow-sm bg-white h-100">
            <h6 class="text-secondary small fw-bold text-uppercase">Services</h6>
            <div class="display-5 fw-bold text-dark mt-2">4</div>
          </div>
        </div>
        <div class="col-lg-3 col-6 mb-3">
          <div class="card p-3 border shadow-sm bg-white h-100">
            <h6 class="text-secondary small fw-bold text-uppercase">Blog Posts</h6>
            <div class="display-5 fw-bold text-dark mt-2">8</div>
          </div>
        </div>
        <div class="col-lg-3 col-6 mb-3">
          <div class="card p-3 border shadow-sm bg-white h-100">
            <h6 class="text-secondary small fw-bold text-uppercase">Total Views</h6>
            <div class="display-5 fw-bold text-dark mt-2">1.2K</div>
          </div>
        </div>
      </div>

      <div class="card p-4 border rounded shadow-sm bg-white">
        <h4 class="fw-bold mb-3">Welcome to CMS Console</h4>
        <p class="text-secondary small leading-relaxed">
          Use the sidebar controls to customize home page sliders, visibility settings, news updates, and media files. Ensure high-resolution imagery is optimized to WebP format before upload for site performance speed.
        </p>
      </div>
    </div>
  `
})
export class DashboardComponent {}
