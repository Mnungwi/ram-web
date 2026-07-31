import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-gallery fade-in-page">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0">Manage Gallery Content</h3>
        <button class="btn btn-primary btn-sm rounded-pill"><i class="bi bi-cloud-upload me-1"></i> Upload Media</button>
      </div>

      <div class="card border rounded p-4 text-center text-muted">
        <i class="bi bi-images fs-1 mb-2"></i>
        <h5>CMS Media Library is online</h5>
        <p class="small mb-0">Upload site construction photos and drone footage categories.</p>
      </div>
    </div>
  `
})
export class AdminGalleryComponent {}
