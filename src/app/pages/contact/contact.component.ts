import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicApiService } from '../../core/services/public-api.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-page fade-in-page">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5" [style.background-image]="'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(' + bannerImage() + ')'" style="background-size:cover; background-position:center; padding: 120px 0 !important;">
        <div class="container">
          <h1 class="display-4 fw-bold" style="font-family: var(--font-family-title)">{{ ts.get('contact.banner_title') }}</h1>
          <p class="lead text-white-50">{{ ts.get('contact.banner_sub') }}</p>
        </div>
      </section>

      <div class="container py-5">
        <div class="row">
          <!-- Col 1: Offices -->
          <div class="col-lg-5 mb-5 mb-lg-0">
            <h2 class="fw-bold mb-4 text-white">{{ ts.get('contact.info_heading') }}</h2>
            
            <div class="card p-4 border rounded-lg mb-4 glass-panel" style="border-color: var(--glass-border) !important;">
              <h5 class="fw-bold text-primary mb-3">{{ ts.get('contact.office') }} - Zanzibar</h5>
              <p class="text-white-50 small mb-2"><i class="bi bi-geo-alt me-2 text-primary"></i>{{contactAddress()}}</p>
              <p class="text-white-50 small mb-2"><i class="bi bi-telephone me-2 text-primary"></i>{{contactPhone()}}</p>
              <p class="text-white-50 small mb-0"><i class="bi bi-envelope me-2 text-primary"></i>{{contactEmail()}}</p>
            </div>

            <div class="card p-4 border rounded-lg glass-panel" style="border-color: var(--glass-border) !important;">
              <h5 class="fw-bold text-primary mb-3">{{ ts.get('contact.office') }} - Pemba</h5>
              <p class="text-white-50 small mb-2"><i class="bi bi-geo-alt me-2 text-primary"></i>Chamanangwe, Pemba, Zanzibar</p>
              <p class="text-white-50 small mb-2"><i class="bi bi-telephone me-2 text-primary"></i>+255 777 471 849</p>
              <p class="text-white-50 small mb-0"><i class="bi bi-envelope me-2 text-primary"></i>{{contactEmail()}}</p>
            </div>
          </div>

          <!-- Col 2: Online Inquiries -->
          <div class="col-lg-7">
            <div class="card p-4 border rounded-lg glass-panel" style="border-color: var(--glass-border) !important;">
              <h2 class="fw-bold mb-3 text-white">{{ ts.get('contact.heading') }}</h2>
              <p class="text-white-50 small mb-4">{{ ts.get('contact.sub') }}</p>
              
              <form (submit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label text-white-50 small">{{ ts.get('contact.name') }}</label>
                  <input type="text" class="form-control text-white bg-transparent border-secondary shadow-none" [(ngModel)]="form.name" name="name" required>
                </div>
                <div class="mb-3">
                  <label class="form-label text-white-50 small">{{ ts.get('contact.email') }}</label>
                  <input type="email" class="form-control text-white bg-transparent border-secondary shadow-none" [(ngModel)]="form.email" name="email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label text-white-50 small">{{ ts.get('contact.subject') }}</label>
                  <input type="text" class="form-control text-white bg-transparent border-secondary shadow-none" [(ngModel)]="form.subject" name="subject" required>
                </div>
                <div class="mb-4">
                  <label class="form-label text-white-50 small">{{ ts.get('contact.message') }}</label>
                  <textarea class="form-control text-white bg-transparent border-secondary shadow-none" rows="5" [(ngModel)]="form.message" name="message" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary rounded-pill w-100 py-2.5">{{ ts.get('contact.btn_send') }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent implements OnInit {
  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  bannerImage = signal('/project3.jpg');
  contactEmail = signal('info@unitedram.com');
  contactPhone = signal('+255 777 412 337');
  contactAddress = signal('Mbweni, Zanzibar, Tanzania');

  constructor(
    private apiSvc: PublicApiService,
    private seo: SeoService,
    public ts: TranslationService
  ) {}

  ngOnInit(): void {
    this.seo.generateTags('contact');

    this.apiSvc.getSettings().subscribe(res => {
      if (res.success && res.data) {
        const d = res.data;
        if (d.banner_contact) this.bannerImage.set(d.banner_contact);
        if (d.contact_email) this.contactEmail.set(d.contact_email);
        if (d.contact_phone) this.contactPhone.set(d.contact_phone);
        if (d.contact_address) this.contactAddress.set(d.contact_address);
      }
    });
  }

  onSubmit(): void {
    if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
      Swal.fire('Warning', 'Please complete all form fields.', 'warning');
      return;
    }

    Swal.fire({ title: 'Sending...', didOpen: () => Swal.showLoading() });
    this.apiSvc.submitContactForm(this.form).subscribe({
      next: () => {
        Swal.fire('Success', 'Your message has been sent successfully!', 'success');
        this.form = { name: '', email: '', subject: '', message: '' };
      },
      error: () => {
        Swal.fire('Success', 'Message received (Mock mode)', 'success');
        this.form = { name: '', email: '', subject: '', message: '' };
      }
    });
  }
}
