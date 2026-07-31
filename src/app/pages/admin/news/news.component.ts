import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-news fade-in-page">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0">Manage Blog & News</h3>
        <button class="btn btn-primary btn-sm rounded-pill"><i class="bi bi-plus-lg me-1"></i> Add Article</button>
      </div>

      <div class="card border rounded p-4 text-center text-muted">
        <i class="bi bi-newspaper fs-1 mb-2"></i>
        <h5>CMS News and Tenders management is online</h5>
        <p class="small mb-0">Publish official bids, career vacancies, and company press releases here.</p>
      </div>
    </div>
  `
})
export class AdminNewsComponent {}
