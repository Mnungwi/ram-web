import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicApiService } from '../../../core/services/public-api.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="service-detail-page fade-in-page" *ngIf="service()">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5 bg-dark" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1920&q=80'); background-size:cover; background-position:center; padding: 100px 0 !important;">
        <div class="container">
          <span class="badge bg-secondary text-uppercase px-3 py-2 mb-3">Service Speciality</span>
          <h1 class="display-4 fw-bold">{{ service()!.title }}</h1>
        </div>
      </section>

      <!-- Details Content -->
      <section class="service-details py-5 bg-white">
        <div class="container py-4">
          <div class="row">
            <div class="col-lg-8">
              <h2 class="fw-bold mb-4">Service Overview</h2>
              <p class="text-secondary leading-relaxed mb-4">
                {{ service()!.description }}
              </p>
              <p class="text-secondary leading-relaxed mb-5">
                Our team brings over 25 years of combined engineering excellence, utilizing pre-cast technologies, advanced structural analysis tools, and highly automated paving layouts to execute complex structures smoothly.
              </p>

              <h4 class="fw-bold mb-4">Key Benefits</h4>
              <ul class="list-group list-group-flush mb-5">
                <li class="list-group-item border-0 px-0 d-flex align-items-center"><i class="bi bi-patch-check-fill text-primary me-3 fs-5"></i> High-strength concrete mixes and long-durability engineering standards</li>
                <li class="list-group-item border-0 px-0 d-flex align-items-center"><i class="bi bi-patch-check-fill text-primary me-3 fs-5"></i> Fully certified ISO quality materials and testing parameters</li>
                <li class="list-group-item border-0 px-0 d-flex align-items-center"><i class="bi bi-patch-check-fill text-primary me-3 fs-5"></i> Environmentally optimized and waste-reduced workflows</li>
              </ul>
            </div>
            
            <div class="col-lg-4">
              <!-- Sidebar CTA -->
              <div class="card bg-light border-0 p-4 rounded-lg shadow-sm text-center">
                <h5 class="fw-bold mb-3">Need Construction Consultation?</h5>
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

  constructor(private route: ActivatedRoute, private apiSvc: PublicApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiSvc.getServices().subscribe(res => {
      if (res.success && id) {
        const item = res.data.find((s: any) => s.id === id);
        this.service.set(item || res.data[0]);
      }
    });
  }
}
