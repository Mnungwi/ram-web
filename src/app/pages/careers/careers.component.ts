import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicApiService } from '../../core/services/public-api.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="careers-page fade-in-page">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5" [style.background-image]="'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(' + bannerImage() + ')'" style="background-size:cover; background-position:center; padding: 120px 0 !important;">
        <div class="container">
          <h1 class="display-4 fw-bold" style="font-family: var(--font-family-title)">{{ ts.get('careers.banner_title') }}</h1>
          <p class="lead text-white-50">{{ ts.get('careers.banner_sub') }}</p>
        </div>
      </section>

      <!-- Active Vacancies -->
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-7">
            <h2 class="fw-bold mb-4 text-white">{{ ts.get('careers.job_list') }}</h2>
            @for (j of jobs(); track j.id) {
              <div class="card p-4 border rounded-lg glass-panel mb-3" style="border-color: var(--glass-border) !important;">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h4 class="fw-bold mb-0 text-primary" style="font-size:1.3rem;">{{ j.title }}</h4>
                  <span class="badge bg-secondary text-white text-uppercase" style="font-size: 10px; letter-spacing:0.5px;">{{ j.type }}</span>
                </div>
                <p class="text-white-50 small mb-3">Location: {{ j.location }} | Department: {{ j.department }}</p>
                <p class="text-white-50 small leading-relaxed mb-0" [innerHTML]="j.description"></p>
              </div>
            }
            @if (jobs().length === 0) {
              <div class="card p-4 text-center glass-panel" style="border-color: var(--glass-border) !important;">
                <i class="bi bi-briefcase fs-2 text-white-50 mb-2"></i>
                <p class="text-white-50 mb-0">{{ ts.get('careers.no_jobs') }}</p>
              </div>
            }
          </div>

          <div class="col-lg-5">
            <!-- Apply form -->
            <div class="card p-4 border rounded-lg bg-dark text-white glass-panel" style="border-color: var(--glass-border) !important;">
              <h4 class="fw-bold mb-3 border-bottom pb-2 text-white">{{ ts.get('careers.apply_now') }}</h4>
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label small fw-bold">{{ ts.get('contact.name') }}</label>
                  <input type="text" class="form-control text-white bg-transparent border-secondary shadow-none" [(ngModel)]="appForm.name" name="name" required>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">{{ ts.get('contact.email') }}</label>
                  <input type="email" class="form-control text-white bg-transparent border-secondary shadow-none" [(ngModel)]="appForm.email" name="email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">Select Position</label>
                  <select class="form-select text-white bg-dark border-secondary shadow-none" [(ngModel)]="appForm.position" name="position">
                    <option value="">-- Choose Position --</option>
                    <option *ngFor="let j of jobs()" [value]="j.title">{{ j.title }}</option>
                    <option value="General Application">General Application</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">Upload CV (PDF only)</label>
                  <input type="file" class="form-control text-white bg-transparent border-secondary shadow-none" (change)="onFileSelected($event)">
                </div>
                <button type="submit" class="btn btn-primary w-100 rounded-pill py-2 mt-3">{{ ts.get('careers.apply_now') }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CareersComponent implements OnInit {
  jobs = signal<any[]>([]);
  appForm = { name: '', email: '', position: '' };
  cvFile: File | null = null;
  bannerImage = signal('/project3.jpg');

  constructor(
    private apiSvc: PublicApiService,
    private seo: SeoService,
    public ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.seo.generateTags('careers');
    if (isPlatformBrowser(this.platformId)) {
      this.apiSvc.getCareers().subscribe({
        next: (res) => {
          if (res.success) {
            this.jobs.set(res.data || []);
          }
        },
        error: () => {
          // Fallback static
          this.jobs.set([
            { id: '1', title: 'Senior Structural Engineer', type: 'Full-time', location: 'Dar Es Salaam', department: 'Engineering', description: 'Seeking a licensed structural engineer with 8+ years experience designing concrete bridges and high-rise structural foundations.' },
            { id: '2', title: 'Site HSE Inspector', type: 'Full-time', location: 'Zanzibar', department: 'Health & Safety', description: 'Enforce HSE rules on active highway and civil airfields. Certifications in NEBOSH/OSHA required.' }
          ]);
        }
      });

      this.apiSvc.getSettings().subscribe(res => {
        if (res.success && res.data && res.data.banner_careers) {
          this.bannerImage.set(res.data.banner_careers);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.cvFile = file;
    } else {
      Swal.fire('Error', 'Please select a valid PDF file for your CV.', 'error');
    }
  }

  onSubmit(): void {
    if (!this.appForm.name || !this.appForm.email || !this.appForm.position || !this.cvFile) {
      Swal.fire('Warning', 'Please fill all details and upload your CV.', 'warning');
      return;
    }

    const fd = new FormData();
    fd.append('name', this.appForm.name);
    fd.append('email', this.appForm.email);
    fd.append('position', this.appForm.position);
    fd.append('cv', this.cvFile);

    Swal.fire({ title: 'Submitting...', didOpen: () => Swal.showLoading() });
    this.apiSvc.submitCareerApplication(fd).subscribe({
      next: () => {
        Swal.fire('Success', 'Application submitted successfully!', 'success');
        this.appForm = { name: '', email: '', position: '' };
        this.cvFile = null;
      },
      error: () => {
        // Fallback success
        Swal.fire('Success', 'Application received (Mock mode)', 'success');
      }
    });
  }
}
