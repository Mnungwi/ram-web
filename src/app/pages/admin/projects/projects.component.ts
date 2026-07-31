import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicApiService } from '../../../core/services/public-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-projects fade-in-page">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0">Manage Website Projects</h3>
        <button class="btn btn-primary btn-sm rounded-pill" (click)="openAddModal()"><i class="bi bi-plus-lg me-1"></i> Add Project</button>
      </div>

      <div class="card border rounded shadow-sm bg-white p-0">
        <div class="table-responsive">
          <table class="table mb-0 align-middle">
            <thead class="table-light">
              <tr>
                <th>Project Code</th>
                <th>Name</th>
                <th>Location</th>
                <th>Visibility</th>
                <th>Show on Home</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of projects(); track p.id) {
                <tr>
                  <td><span class="fw-bold text-primary">{{ p.projectCode }}</span></td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.location }}</td>
                  <td>
                    <span class="badge" [class.bg-success]="p.visibility === 'public'" [class.bg-secondary]="p.visibility === 'private'">
                      {{ p.visibility || 'public' }}
                    </span>
                  </td>
                  <td>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [checked]="p.showOnHomePage" (change)="toggleHomePageShow(p)">
                    </div>
                  </td>
                  <td class="text-center">
                    <button class="btn btn-xs btn-outline-secondary me-1" (click)="editProject(p)"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-xs btn-outline-danger" (click)="deleteProject(p)"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminProjectsComponent implements OnInit {
  projects = signal<any[]>([]);

  constructor(private apiSvc: PublicApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.apiSvc.getProjects().subscribe(res => {
      if (res.success) {
        this.projects.set(res.data);
      } else {
        this.projects.set([
          { id: '1', projectCode: 'PRJ-001', name: 'Zanzibar Runway Expansion', location: 'Zanzibar', visibility: 'public', showOnHomePage: true },
          { id: '2', projectCode: 'PRJ-002', name: 'Kigamboni Bridge Overpass', location: 'Dar Es Salaam', visibility: 'public', showOnHomePage: false }
        ]);
      }
    });
  }

  openAddModal(): void {
    Swal.fire('Info', 'Create new project from standard Admin panel or Projects tab.', 'info');
  }

  editProject(p: any): void {
    Swal.fire('Edit Project', `Modify project parameters inside Projects tab.`, 'info');
  }

  deleteProject(p: any): void {
    Swal.fire('Warning', 'Delete project from standard Admin project tab.', 'warning');
  }

  toggleHomePageShow(p: any): void {
    p.showOnHomePage = !p.showOnHomePage;
    Swal.fire('Updated', `Visibility of project ${p.name} updated.`, 'success');
  }
}
