import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicApiService } from '../../../core/services/public-api.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="project-detail-page fade-in-page" *ngIf="project()">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5" [style.background-image]="'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(' + resolveImage(project()!.image || '/project3.jpg') + ')'" style="background-size:cover; background-position:center; padding: 120px 0 !important;">
        <div class="container">
          <span class="badge bg-secondary text-uppercase px-3 py-2 mb-3">Project Showcase</span>
          <h1 class="display-4 fw-bold" style="font-family: var(--font-family-title)">{{ project()!.name }}</h1>
          <p class="lead"><i class="bi bi-geo-alt me-2 text-primary"></i>{{ project()!.location || 'East Africa' }}</p>
        </div>
      </section>

      <!-- Details Content -->
      <section class="project-details py-5 bg-dark">
        <div class="container py-4">
          <div class="row">
            <div class="col-lg-8">
              <h2 class="fw-bold mb-4 text-white">Project Overview</h2>
              <p class="text-white-50 leading-relaxed mb-5 fs-5">
                {{ project()!.description }}
              </p>
              
              <!-- Construction Challenges & Solutions -->
              <h4 class="fw-bold mt-5 mb-4 text-white">Construction Challenges & Solutions</h4>
              <div class="p-4 border rounded mb-5 glass-panel" style="border-color: var(--glass-border) !important;">
                <h6 class="text-white"><i class="bi bi-exclamation-triangle-fill text-primary me-2"></i>The Challenge:</h6>
                <p class="text-white-50 small leading-relaxed">Deep soil instability and intense seasonal rainfall requiring quick-acting structural reinforcements.</p>
                <h6 class="mt-4 text-white"><i class="bi bi-check-circle-fill text-success me-2"></i>The Solution:</h6>
                <p class="text-white-50 small mb-0 leading-relaxed">Engineered micro-pile foundations coupled with rapid hydration additives to cure concrete under wet conditions.</p>
              </div>

              <!-- Project Library / Gallery -->
              <h4 class="fw-bold mt-5 mb-4 text-white">Project Gallery & Library</h4>
              <div class="row g-3">
                <div *ngFor="let img of libraryImages" class="col-md-4 col-6">
                  <div class="card border rounded-lg overflow-hidden gallery-card cursor-pointer position-relative" style="height:150px; border-color: var(--glass-border) !important;" (click)="openLightbox(img)">
                    <img [src]="img" loading="lazy" class="w-100 h-100" style="object-fit:cover; transition: transform 0.5s ease;">
                    <div class="gallery-hover-overlay position-absolute inset-0 d-flex align-items-center justify-content-center text-white" style="background: rgba(62, 80, 180, 0.4); opacity: 0; transition: all 0.3s ease;">
                      <div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 45px; height: 45px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        <i class="bi bi-zoom-in fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-lg-4">
              <!-- Meta Cards -->
              <div class="card p-4 border rounded-lg mb-4 glass-panel" style="border-color: var(--glass-border) !important;">
                <h5 class="fw-bold mb-4 border-bottom pb-2 text-white">Contract Metadata</h5>
                <ul class="list-unstyled">
                  <li class="mb-4">
                    <span class="text-white-50 d-block small mb-1">Client Authority</span>
                    <strong class="text-white fs-5">Government Infrastructure Ministry</strong>
                  </li>
                  <li class="mb-4">
                    <span class="text-white-50 d-block small mb-1">Contract Valuation</span>
                    <strong class="text-primary fs-5">TZS 150,000,000</strong>
                  </li>
                  <li class="mb-4">
                    <span class="text-white-50 d-block small mb-1">Duration</span>
                    <strong class="text-white fs-5">18 Calendar Months</strong>
                  </li>
                  <li>
                    <span class="text-white-50 d-block small mb-1">Current Status</span>
                    <span class="badge text-uppercase" style="background: var(--gold-gradient)">{{ project()!.status }}</span>
                  </li>
                </ul>
              </div>

              <!-- CTA -->
              <div class="card bg-dark text-white p-4 text-center rounded-lg glass-panel" style="border-color: var(--glass-border) !important;">
                <h5 class="fw-bold mb-3 text-white">Partner with Us</h5>
                <p class="text-white-50 small mb-4">Leverage our certified engineering equipment and resources on your next project bid.</p>
                <a routerLink="/contact" class="btn btn-primary rounded-pill w-100">Consult Our Engineers</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Lightbox Modal with Slider -->
      <div *ngIf="activeLightboxImage()" class="modal fade show d-block" style="background: rgba(15, 23, 42, 0.96); z-index: 3000;">
        <!-- Left Arrow -->
        <button (click)="prevLightboxImage()" class="lightbox-arrow position-absolute start-0 top-50 translate-middle-y ms-md-4 ms-2 btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center border-0 shadow-lg" style="width: 50px; height: 50px; z-index: 3002; background: rgba(30,41,59,0.85); transition: all 0.3s ease;">
          <i class="bi bi-chevron-left fs-3 text-white"></i>
        </button>

        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content bg-transparent border-0 text-center position-relative">
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" (click)="activeLightboxImage.set(null)" style="z-index: 3001;"></button>
            <img [src]="activeLightboxImage()!" class="img-fluid rounded shadow-lg max-vh-75 mx-auto border" [class.lightbox-img-fade]="!isTransitioning()" style="border-color: rgba(255,255,255,0.15) !important; object-fit: contain;">
          </div>
        </div>

        <!-- Right Arrow -->
        <button (click)="nextLightboxImage()" class="lightbox-arrow position-absolute end-0 top-50 translate-middle-y me-md-4 me-2 btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center border-0 shadow-lg" style="width: 50px; height: 50px; z-index: 3002; background: rgba(30,41,59,0.85); transition: all 0.3s ease;">
          <i class="bi bi-chevron-right fs-3 text-white"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .gallery-card {
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .gallery-card:hover {
      border-color: var(--secondary-color) !important;
      box-shadow: 0 8px 20px rgba(217, 119, 6, 0.2) !important;
    }
    .gallery-card:hover img {
      transform: scale(1.08);
    }
    .gallery-card:hover .gallery-hover-overlay {
      opacity: 1 !important;
    }
    .lightbox-arrow:hover {
      background: var(--primary-color) !important;
      transform: scale(1.1) translateY(-50%) !important;
      box-shadow: 0 5px 20px rgba(37,99,235,0.5) !important;
    }
    .lightbox-img-fade {
      animation: lightboxFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes lightboxFade {
      0% { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project = signal<any | null>(null);
  libraryImages: string[] = [];
  activeLightboxImage = signal<string | null>(null);
  isTransitioning = signal(false);

  constructor(
    private route: ActivatedRoute, 
    private apiSvc: PublicApiService,
    private titleSvc: Title,
    private metaSvc: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Set default fallback first so SSR always has structured page content
    this.project.set({
      id: id || 'default',
      name: 'Zanzibar Runway Expansion',
      description: 'Major rehabilitation, civil airfield works, and terminal apron expansion to enable widebody flight access.',
      status: 'Completed',
      location: 'Zanzibar, Tanzania',
      image: '/project3.jpg'
    });
    this.libraryImages = ['/malindi2.jpg', '/mbweni-4.png', '/tunguu1.jpg'];

    if (id && isPlatformBrowser(this.platformId)) {
      this.apiSvc.getProjectById(id).subscribe(res => {
        if (res.success && res.data) {
          const p = res.data;
          this.project.set(p);
          // Set dynamic SEO tags for the project
          this.titleSvc.setTitle(`${p.name} - Project Showcase | United Ram`);
          this.metaSvc.updateTag({ name: 'description', content: p.description || '' });
          this.metaSvc.updateTag({ name: 'keywords', content: `${p.name}, ${p.location}, united ram construction` });

          // Fetch only gallery images associated with this project and are public
          this.apiSvc.getGallery({ projectId: id }).subscribe(galleryRes => {
            if (galleryRes.success && galleryRes.data && galleryRes.data.length > 0) {
              this.libraryImages = galleryRes.data.map((item: any) => this.resolveImage(item.imageUrl));
            } else {
              // Fallback to project's main image if no gallery pictures exist
              this.libraryImages = [this.resolveImage(p.image || '/project3.jpg')];
            }
          });
        }
      });
    }
  }

  resolveImage(imagePath: string): string {
    if (!imagePath) return '/project3.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads') || imagePath.startsWith('uploads')) {
      const path = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
      return 'http://localhost:3000' + path;
    }
    return imagePath;
  }

  openLightbox(img: string) {
    this.activeLightboxImage.set(img);
  }

  nextLightboxImage() {
    const images = this.libraryImages;
    const current = this.activeLightboxImage();
    if (!current || images.length === 0) return;
    const idx = images.indexOf(current);
    if (idx === -1) return;
    const nextIdx = (idx + 1) % images.length;

    this.isTransitioning.set(true);
    this.activeLightboxImage.set(images[nextIdx]);
    setTimeout(() => this.isTransitioning.set(false), 50);
  }

  prevLightboxImage() {
    const images = this.libraryImages;
    const current = this.activeLightboxImage();
    if (!current || images.length === 0) return;
    const idx = images.indexOf(current);
    if (idx === -1) return;
    const prevIdx = (idx - 1 + images.length) % images.length;

    this.isTransitioning.set(true);
    this.activeLightboxImage.set(images[prevIdx]);
    setTimeout(() => this.isTransitioning.set(false), 50);
  }
}
