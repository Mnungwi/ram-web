import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { PublicApiService } from '../../../core/services/public-api.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="service-detail-page fade-in-page" *ngIf="service()">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5 bg-dark" [style.background-image]="'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(' + bannerImage() + ')'" style="background-size:cover; background-position:center; padding: 100px 0 !important;">
        <div class="container">
          <span class="badge bg-secondary text-uppercase px-3 py-2 mb-3">Service Speciality</span>
          <h1 class="display-4 fw-bold">{{ ts.pick(service()!.title, service()!.title_sw) }}</h1>
        </div>
      </section>

      <!-- Details Content -->
      <section class="service-details py-5 bg-white">
        <div class="container py-4">
          <div class="row">
            <div class="col-lg-8">
              <h2 class="fw-bold mb-4 text-dark">Service Overview</h2>
              <p class="text-secondary leading-relaxed mb-4" [innerHTML]="ts.pick(service()!.description, service()!.description_sw)"></p>
              <p class="text-secondary leading-relaxed mb-5" *ngIf="overviewText()" [innerHTML]="overviewText()"></p>

              <h4 class="fw-bold mb-4 text-dark">Key Benefits</h4>
              <ul class="list-group list-group-flush mb-5">
                <li class="list-group-item border-0 px-0 d-flex align-items-center" *ngFor="let b of benefits()">
                  <i class="bi bi-patch-check-fill text-primary me-3 fs-5"></i> {{ b }}
                </li>
              </ul>
            </div>
            
            <div class="col-lg-4">
              <!-- Sidebar CTA -->
              <div class="card bg-light border-0 p-4 rounded-lg shadow-sm text-center">
                <h5 class="fw-bold mb-3 text-dark">Need Construction Consultation?</h5>
                <p class="text-secondary small mb-4">Speak with our senior structural consultants and engineering managers today.</p>
                <a routerLink="/contact" class="btn btn-primary rounded-pill w-100">Get a Free Quote</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ServiceDetailComponent implements OnInit {
  service = signal<any | null>(null);
  bannerImage = signal('/project3.jpg');

  constructor(
    private route: ActivatedRoute,
    private apiSvc: PublicApiService,
    public ts: TranslationService,
    private titleSvc: Title,
    private metaSvc: Meta,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiSvc.getServices().subscribe(res => {
      if (res.success && id) {
        const item = res.data.find((s: any) => s.id === id);
        const found = item || res.data[0];
        this.service.set(found);
        if (found) {
          const title = this.ts.pick(found.title, found.title_sw);
          this.titleSvc.setTitle(`${title} - Services | United Ram Construction`);
          this.metaSvc.updateTag({ name: 'description', content: this.ts.pick(found.description, found.description_sw) || '' });
        }
      }
    });

    this.apiSvc.getSettings().subscribe(res => {
      if (res.success && res.data && res.data.banner_services) {
        this.bannerImage.set(res.data.banner_services);
      }
    });
  }

  overviewText(): string {
    const s = this.service();
    return this.ts.pick(s?.overviewText, s?.overviewText_sw) ||
      'Our team brings over 25 years of combined engineering excellence, utilizing pre-cast technologies, advanced structural analysis tools, and highly automated paving layouts to execute complex structures smoothly.';
  }

  benefits(): string[] {
    const raw = this.service()?.benefitsJson;
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      } catch {}
    }
    return [
      'High-strength concrete mixes and long-durability engineering standards',
      'Fully certified ISO quality materials and testing parameters',
      'Environmentally optimized and waste-reduced workflows'
    ];
  }
}
