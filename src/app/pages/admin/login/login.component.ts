import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-login-page d-flex align-items-center justify-content-center bg-light" style="height: 90vh;">
      <div class="card p-4 border shadow-lg rounded-lg" style="max-width: 400px; width: 100%;">
        <div class="text-center mb-4">
          <i class="bi bi-shield-lock-fill text-primary fs-1 mb-2"></i>
          <h4 class="fw-bold mb-1">CMS Control Panel</h4>
          <p class="text-secondary small">Sign in to manage company contents</p>
        </div>
        <form (ngSubmit)="onLogin()">
          <div class="mb-3">
            <label class="form-label small fw-bold">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" placeholder="admin@example.com" required>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required>
          </div>
          <button type="submit" class="btn btn-primary w-100 rounded-pill py-2 mt-2">Sign In</button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router, private http: HttpClient) {}

  onLogin() {
    if (!this.email || !this.password) {
      Swal.fire('Warning', 'Please enter both email and password.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Signing in...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.post<any>('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        Swal.close();
        if (res.success && res.data && res.data.accessToken) {
          localStorage.setItem('adminToken', res.data.accessToken);
          localStorage.setItem('adminUser', JSON.stringify(res.data.user));
          this.router.navigate(['/admin/dashboard']);
        } else {
          Swal.fire('Error', res.message || 'Authentication failed.', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        // Fallback for easy testing in development/mock modes
        if (this.email === 'admin@admin.com' && this.password === 'admin') {
          localStorage.setItem('adminToken', 'mock-token-admin');
          this.router.navigate(['/admin/dashboard']);
        } else {
          const errMsg = err.error?.message || 'Unable to connect to the authentication server.';
          Swal.fire('Authentication Error', errMsg, 'error');
        }
      }
    });
  }
}
