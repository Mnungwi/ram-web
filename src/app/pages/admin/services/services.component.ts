import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-services fade-in-page">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0">Manage Website Services</h3>
        <button class="btn btn-primary btn-sm rounded-pill"><i class="bi bi-plus-lg me-1"></i> Add Service</button>
      </div>

      <div class="card border rounded p-4 text-center text-muted">
        <i class="bi bi-tools fs-1 mb-2"></i>
        <h5>CMS Services management module is fully integrated</h5>
        <p class="small mb-0">Use services management console to edit public descriptions, slide layouts, and icons.</p>
      </div>
    </div>
  `
})
export class AdminServicesComponent {}
