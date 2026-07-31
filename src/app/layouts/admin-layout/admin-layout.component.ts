import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  adminName = 'System Admin';

  constructor(private router: Router) {}

  logout() {
    console.log('Logging out from admin...');
    localStorage.removeItem('adminToken');
    this.router.navigate(['/admin/login']);
  }
}
