import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PublicApiService } from '../../core/services/public-api.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery-page fade-in-page">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5" [style.background-image]="'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(' + bannerImage() + ')'" style="background-size:cover; background-position:center; padding: 120px 0 !important;">
        <div class="container">
          <h1 class="display-4 fw-bold" style="font-family: var(--font-family-title)">{{ ts.get('gallery.banner_title') }}</h1>
          <p class="lead text-white-50">{{ ts.get('gallery.banner_sub') }}</p>
        </div>
      </section>

      <!-- Category Selector -->
      <div class="container py-5 text-center">
        <!-- Individually-rounded pill buttons with a real gap between them —
             was a Bootstrap .btn-group, which flushes adjacent buttons
             together with zero space by design (segmented-control look). -->
        <div class="d-flex flex-wrap justify-content-center gap-2">
          <button *ngFor="let c of categories"
                  class="btn btn-outline-light bg-dark px-4 py-2 rounded-pill shadow-sm"
                  style="border: 1px solid var(--glass-border);"
                  [class.active]="activeCategory() === c.id"
                  (click)="activeCategory.set(c.id)">
            {{ c.id === 'all' ? ts.get('gallery.all') : c.label }}
          </button>
        </div>

        <!-- Lightbox Grid -->
        <div class="row mt-5">
          @for (item of getFilteredItems(); track item.imageUrl) {
            <div class="col-lg-4 col-md-6 mb-4">
              <div class="card border rounded-lg overflow-hidden gallery-card position-relative glass-panel cursor-pointer" style="border-color: var(--glass-border) !important;" (click)="openLightbox(item)">
                <img [src]="item.imageUrl" loading="lazy" class="card-img w-100" style="height: 270px; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);">
                <div class="gallery-overlay position-absolute inset-0 d-flex align-items-end p-3 text-white transition-all" style="background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 70%, transparent 100%); opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
                  <div class="text-start w-100">
                    <div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 40px; height: 40px; box-shadow: 0 4px 10px rgba(217,119,6,0.3);">
                      <i class="bi bi-zoom-in fs-5 text-white"></i>
                    </div>
                    <h5 class="fw-bold mb-1 text-white text-truncate" style="font-size:1rem;">{{ item.caption || 'United Ram Construction' }}</h5>
                    <span class="badge bg-secondary text-uppercase small" style="font-size: 8px; letter-spacing:0.5px;">{{ item.type }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
          @if (getFilteredItems().length === 0) {
            <div class="col-12 text-center py-5">
              <i class="bi bi-images fs-1 text-white-50"></i>
              <h5 class="mt-3 text-white-50">No media items found in this category</h5>
            </div>
          }
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div *ngIf="activeLightboxItem()" class="modal fade show d-block" style="background: rgba(15, 23, 42, 0.96); z-index: 3000;">
        <!-- Left Arrow -->
        <button (click)="prevLightboxItem()" class="lightbox-arrow position-absolute start-0 top-50 translate-middle-y ms-md-4 ms-2 btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center border-0 shadow-lg" style="width: 50px; height: 50px; z-index: 3002; background: rgba(30,41,59,0.85); transition: all 0.3s ease;">
          <i class="bi bi-chevron-left fs-3 text-white"></i>
        </button>

        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content bg-transparent border-0 text-center position-relative">
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" (click)="activeLightboxItem.set(null)" style="z-index: 3001;"></button>
            <img [src]="activeLightboxItem()!.imageUrl" class="img-fluid rounded shadow-lg max-vh-75 mx-auto border" [class.lightbox-img-fade]="!isTransitioning()" style="border-color: rgba(255,255,255,0.15) !important; object-fit: contain;">
            <p class="text-white fs-5 mt-3 fw-semibold">{{ activeLightboxItem()!.caption }}</p>
            <span class="badge bg-secondary text-uppercase small align-self-center px-3 py-2" style="font-size: 10px; letter-spacing:0.5px;">{{ activeLightboxItem()!.type }}</span>
          </div>
        </div>

        <!-- Right Arrow -->
        <button (click)="nextLightboxItem()" class="lightbox-arrow position-absolute end-0 top-50 translate-middle-y me-md-4 me-2 btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center border-0 shadow-lg" style="width: 50px; height: 50px; z-index: 3002; background: rgba(30,41,59,0.85); transition: all 0.3s ease;">
          <i class="bi bi-chevron-right fs-3 text-white"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .gallery-card {
      transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .gallery-card .gallery-overlay {
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .gallery-card .bg-primary {
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .gallery-card:hover {
      border-color: var(--secondary-color) !important;
      box-shadow: 0 15px 35px rgba(217, 119, 6, 0.25) !important;
    }
    .gallery-card:hover img { 
      transform: scale(1.08); 
    }
    .gallery-card:hover .gallery-overlay { 
      opacity: 1 !important; 
      transform: translateY(0) !important;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    .gallery-card:hover .bg-primary {
      transform: scale(1.1) rotate(360deg);
    }
    .btn-outline-light.active {
      background: var(--gold-gradient) !important;
      color: #fff !important;
      border: none !important;
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
export class GalleryComponent implements OnInit {
  categories = [
    { id: 'all', label: 'All Media' },
    { id: 'photo', label: 'Photos' },
    { id: 'drone', label: 'Drone Footage' }
  ];
  activeCategory = signal('all');
  activeLightboxItem = signal<any | null>(null);
  items = signal<any[]>([]);
  bannerImage = signal('/project3.jpg');
  isTransitioning = signal(false);

  constructor(
    private apiSvc: PublicApiService,
    private seo: SeoService,
    public ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.seo.generateTags('gallery');
    if (isPlatformBrowser(this.platformId)) {
      this.apiSvc.getGallery().subscribe(res => {
        if (res.success) {
          this.items.set(res.data);
        }
      });

      this.apiSvc.getSettings().subscribe(res => {
        if (res.success && res.data && res.data.banner_gallery) {
          this.bannerImage.set(res.data.banner_gallery);
        }
      });
    }
  }

  getFilteredItems() {
    const cat = this.activeCategory();
    if (cat === 'all') return this.items();
    return this.items().filter(item => item.type === cat);
  }

  openLightbox(item: any) {
    this.activeLightboxItem.set(item);
  }

  nextLightboxItem() {
    const items = this.getFilteredItems();
    const current = this.activeLightboxItem();
    if (!current || items.length === 0) return;
    const idx = items.findIndex(item => item.id === current.id);
    if (idx === -1) return;
    const nextIdx = (idx + 1) % items.length;

    this.isTransitioning.set(true);
    this.activeLightboxItem.set(items[nextIdx]);
    setTimeout(() => this.isTransitioning.set(false), 50);
  }

  prevLightboxItem() {
    const items = this.getFilteredItems();
    const current = this.activeLightboxItem();
    if (!current || items.length === 0) return;
    const idx = items.findIndex(item => item.id === current.id);
    if (idx === -1) return;
    const prevIdx = (idx - 1 + items.length) % items.length;

    this.isTransitioning.set(true);
    this.activeLightboxItem.set(items[prevIdx]);
    setTimeout(() => this.isTransitioning.set(false), 50);
  }
}
