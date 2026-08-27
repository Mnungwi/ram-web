import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/services/public-api.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="services-page fade-in-page">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5" [style.background-image]="'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(' + bannerImage() + ')'" style="background-size:cover; background-position:center; padding: 120px 0 !important;">
        <div class="container">
          <h1 class="display-4 fw-bold" style="font-family: var(--font-family-title)">{{ ts.get('services.banner_title') }}</h1>
          <p class="lead text-white-50">{{ ts.get('services.banner_sub') }}</p>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="services-grid-section py-5 bg-dark">
        <div class="container py-5">
          <div class="row">
            @for (svc of services(); track svc.id) {
              <div class="col-lg-6 mb-4">
                <div class="p-4 border rounded-lg glass-panel h-100 d-flex gap-4" style="border-color: var(--glass-border) !important; transition: all 0.4s ease;" onmouseover="this.style.borderColor='var(--secondary-color)'" onmouseout="this.style.borderColor='var(--glass-border)'">
                  <div class="icon-wrapper bg-dark text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width:70px; height:70px; border: 1px solid rgba(255,255,255,0.08);">
                    <i class="bi {{ svc.icon }} fs-3 text-secondary"></i>
                  </div>
                  <div>
                    <h3 class="fw-bold mb-3 text-white" style="font-size: 1.45rem;">{{ ts.pick(svc.title, svc.title_sw) }}</h3>
                    <p class="text-white-50 small leading-relaxed mb-4">{{ ts.pick(svc.description, svc.description_sw) }}</p>
                    <a [routerLink]="['/services', svc.id]" class="btn btn-sm btn-outline-light rounded-pill px-4">
                      {{ ts.get('services.btn_details') }} <i class="bi bi-arrow-right ms-1 text-primary"></i>
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `
})
export class ServicesComponent implements OnInit {
  services = signal<any[]>([]);
  bannerImage = signal('/project3.jpg');

  constructor(
    private apiSvc: PublicApiService,
    private seo: SeoService,
    public ts: TranslationService
  ) {}

  ngOnInit(): void {
    this.seo.generateTags('services');
    this.apiSvc.getServices().subscribe(res => {
      if (res.success) this.services.set(res.data);
    });

    this.apiSvc.getSettings().subscribe(res => {
      if (res.success && res.data && res.data.banner_services) {
        this.bannerImage.set(res.data.banner_services);
      }
    });
  }
}
