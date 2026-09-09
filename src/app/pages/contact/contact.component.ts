import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicApiService } from '../../core/services/public-api.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

            <div class="card p-4 border rounded-lg glass-panel mb-4" style="border-color: var(--glass-border) !important;">
              <h5 class="fw-bold text-primary mb-3">{{ ts.get('contact.office') }} - Pemba</h5>
              <p class="text-white-50 small mb-2"><i class="bi bi-geo-alt me-2 text-primary"></i>{{pembaAddress()}}</p>
              <p class="text-white-50 small mb-2"><i class="bi bi-telephone me-2 text-primary"></i>{{pembaPhone()}}</p>
              <p class="text-white-50 small mb-0"><i class="bi bi-envelope me-2 text-primary"></i>{{pembaEmail()}}</p>
            </div>

            <!-- Social Media — DB-managed (Admin > Website Content > Branding &
                 Contact Info); a platform's icon only appears once its URL is
                 filled in, so an unconfigured platform never shows a dead link. -->
            <div class="card p-4 border rounded-lg glass-panel" style="border-color: var(--glass-border) !important;" *ngIf="hasAnySocialLink()">
              <h5 class="fw-bold text-primary mb-3">{{ ts.get('contact.follow_us') }}</h5>
              <div class="d-flex flex-wrap gap-2">
                <a *ngIf="socialFacebook()" [href]="socialFacebook()" target="_blank" rel="noopener"
                   class="btn btn-outline-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2">
                  <i class="bi bi-facebook"></i> Facebook
                </a>
                <a *ngIf="socialInstagram()" [href]="socialInstagram()" target="_blank" rel="noopener"
                   class="btn btn-outline-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2">
                  <i class="bi bi-instagram"></i> Instagram
                </a>
                <a *ngIf="socialTwitter()" [href]="socialTwitter()" target="_blank" rel="noopener"
                   class="btn btn-outline-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2">
                  <i class="bi bi-twitter-x"></i> Twitter / X
                </a>
                <a *ngIf="socialLinkedin()" [href]="socialLinkedin()" target="_blank" rel="noopener"
                   class="btn btn-outline-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2">
                  <i class="bi bi-linkedin"></i> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <!-- Col 2: Online Inquiries -->
          <div class="col-lg-7">
            <div class="card p-4 border rounded-lg glass-panel" style="border-color: var(--glass-border) !important;">
              <h2 class="fw-bold mb-3 text-white">{{ ts.get('contact.heading') }}</h2>
              <p class="text-white-50 small mb-4">{{ ts.get('contact.sub') }}</p>

              <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
                <div class="mb-3">
                  <label class="form-label text-white-50 small">{{ ts.get('contact.name') }}</label>
                  <input type="text" class="form-control text-white bg-transparent border-secondary shadow-none"
                         formControlName="name"
                         [class.is-invalid]="name.invalid && name.dirty">
                  <div class="invalid-feedback d-block" *ngIf="name.invalid && name.dirty">
                    {{ ts.get('validation.required') }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label text-white-50 small">{{ ts.get('contact.email') }}</label>
                  <input type="email" class="form-control text-white bg-transparent border-secondary shadow-none"
                         formControlName="email"
                         [class.is-invalid]="email.invalid && email.dirty">
                  <div class="invalid-feedback d-block" *ngIf="email.invalid && email.dirty">
                    {{ email.errors?.['required'] ? ts.get('validation.required') : ts.get('validation.email') }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label text-white-50 small">{{ ts.get('contact.subject') }}</label>
                  <input type="text" class="form-control text-white bg-transparent border-secondary shadow-none"
                         formControlName="subject"
                         [class.is-invalid]="subject.invalid && subject.dirty">
                  <div class="invalid-feedback d-block" *ngIf="subject.invalid && subject.dirty">
                    {{ ts.get('validation.required') }}
                  </div>
                </div>
                <div class="mb-4">
                  <label class="form-label text-white-50 small">{{ ts.get('contact.message') }}</label>
                  <textarea class="form-control text-white bg-transparent border-secondary shadow-none" rows="5"
                            formControlName="message"
                            [class.is-invalid]="message.invalid && message.dirty"></textarea>
                  <div class="invalid-feedback d-block" *ngIf="message.invalid && message.dirty">
                    {{ message.errors?.['required'] ? ts.get('validation.required') : ts.get('validation.minlength') }}
                  </div>
                </div>
                <button type="submit" class="btn btn-primary rounded-pill w-100 py-2.5" [disabled]="submitting()">
                  {{ ts.get('contact.btn_send') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  submitting = signal(false);

  bannerImage = signal('/project3.jpg');
  contactEmail = signal('info@unitedram.com');
  contactPhone = signal('+255 777 412 337');
  contactAddress = signal('Mbweni, Zanzibar, Tanzania');
  pembaAddress = signal('Chamanangwe, Pemba, Zanzibar');
  pembaPhone = signal('+255 777 471 849');
  pembaEmail = signal('info@unitedram.com');

  // Social media — DB-managed via website_settings (social_facebook/
  // social_twitter/social_instagram/social_linkedin), same keys already
  // saved by Admin > Website Content > Branding & Contact Info.
  socialFacebook = signal('');
  socialTwitter = signal('');
  socialInstagram = signal('');
  socialLinkedin = signal('');

  constructor(
    private fb: FormBuilder,
    private apiSvc: PublicApiService,
    private seo: SeoService,
    public ts: TranslationService
  ) {
    // Reactive form with live (updateOn: 'change') validators — errors are
    // recomputed on every keystroke, not just on blur/submit like the old
    // template-driven + native HTML5 "required"/"type=email" attributes did.
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get name() { return this.form.get('name')!; }
  get email() { return this.form.get('email')!; }
  get subject() { return this.form.get('subject')!; }
  get message() { return this.form.get('message')!; }

  ngOnInit(): void {
    this.seo.generateTags('contact');

    this.apiSvc.getSettings().subscribe(res => {
      if (res.success && res.data) {
        const d = res.data;
        if (d.banner_contact) this.bannerImage.set(d.banner_contact);
        if (d.contact_email) this.contactEmail.set(d.contact_email);
        if (d.contact_phone) this.contactPhone.set(d.contact_phone);
        if (d.contact_address) this.contactAddress.set(d.contact_address);
        if (d.contact_pemba_address) this.pembaAddress.set(d.contact_pemba_address);
        if (d.contact_pemba_phone) this.pembaPhone.set(d.contact_pemba_phone);
        if (d.contact_pemba_email) this.pembaEmail.set(d.contact_pemba_email);
        if (d.social_facebook) this.socialFacebook.set(d.social_facebook);
        if (d.social_twitter) this.socialTwitter.set(d.social_twitter);
        if (d.social_instagram) this.socialInstagram.set(d.social_instagram);
        if (d.social_linkedin) this.socialLinkedin.set(d.social_linkedin);
      }
    });
  }

  hasAnySocialLink(): boolean {
    return !!(this.socialFacebook() || this.socialTwitter() || this.socialInstagram() || this.socialLinkedin());
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // markAsDirty too, so the *ngIf error blocks (which key off `.dirty`,
      // not `.touched`) light up immediately on a submit attempt as well.
      Object.values(this.form.controls).forEach(c => c.markAsDirty());
      Swal.fire('Warning', 'Please correct the highlighted fields.', 'warning');
      return;
    }

    this.submitting.set(true);
    Swal.fire({ title: this.ts.get('contact.sending'), didOpen: () => Swal.showLoading() });
    this.apiSvc.submitContactForm(this.form.value).subscribe({
      next: () => {
        this.submitting.set(false);
        Swal.fire('Success', this.ts.get('contact.success'), 'success');
        this.form.reset();
      },
      error: () => {
        this.submitting.set(false);
        Swal.fire('Success', 'Message received (Mock mode)', 'success');
        this.form.reset();
      }
    });
  }
}
