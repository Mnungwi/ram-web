import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicApiService } from '../../core/services/public-api.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="projects-page fade-in-page">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5" [style.background-image]="'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(' + bannerImage() + ')'" style="background-size:cover; background-position:center; padding: 120px 0 !important;">
        <div class="container">
          <h1 class="display-4 fw-bold" style="font-family: var(--font-family-title)">{{ ts.get('projects.banner_title') }}</h1>
          <p class="lead text-white-50">{{ ts.get('projects.banner_sub') }}</p>
        </div>
      </section>

      <!-- Advanced Filter Toolbar -->
      <div class="container py-5">
        <div class="card p-3 border rounded shadow-lg bg-dark mb-5 glass-panel" style="border-color: var(--glass-border) !important;">
          <div class="row g-3 align-items-center">
            <div class="col-md-4">
              <input type="text" class="form-control text-white bg-transparent border-secondary shadow-none" placeholder="Search by name, location..." [(ngModel)]="filters.search" (input)="load()">
            </div>
            <div class="col-md-3">
              <select class="form-select text-white bg-dark border-secondary shadow-none" [(ngModel)]="filters.type" (change)="load()">
                <option value="">{{ ts.get('projects.all') }}</option>
                <option value="building">Building Construction</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="water">Water Supply</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select text-white bg-dark border-secondary shadow-none" [(ngModel)]="filters.status" (change)="load()">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100" (click)="clearFilters()"><i class="bi bi-x-circle me-1"></i> Clear</button>
            </div>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="row">
          @for (p of pagedProjects(); track p.id) {
            <div class="col-md-6 mb-4">
              <div class="card h-100 border rounded-lg overflow-hidden glass-panel" style="transition: all 0.4s ease; border-color: var(--glass-border) !important;">
                <div class="position-relative" style="height: 260px; overflow:hidden;">
                  <img [src]="p.image || '/project3.jpg'" loading="lazy" class="card-img-top w-100 h-100" style="object-fit: cover; transition: transform 0.6s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                  <span class="badge position-absolute top-0 end-0 m-3 text-uppercase" style="background: var(--gold-gradient); font-size:11px; font-weight:700; letter-spacing:0.5px;">{{ ts.statusLabel(p.status) }}</span>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-secondary text-uppercase small" style="letter-spacing: 0.5px;">{{ p.category || 'Civil Works' }}</span>
                    <small class="text-white-50"><i class="bi bi-geo-alt me-1 text-primary"></i>{{ ts.get('projects.location') }}: {{ p.location || 'Zanzibar' }}</small>
                  </div>
                  <h4 class="fw-bold mb-3 text-white" style="font-size:1.35rem; line-height:1.2;">{{ ts.pick(p.name, p.name_sw) }}</h4>
                  <p class="text-white-50 small leading-relaxed mb-4 flex-grow-1">{{ ts.pick(p.description, p.description_sw) }}</p>
                  
                  <a [routerLink]="['/projects', p.id]" class="btn btn-sm btn-outline-light rounded-pill align-self-start px-4">
                    {{ ts.get('projects.view_details') }} <i class="bi bi-arrow-right ms-1 text-primary"></i>
                  </a>
                </div>
              </div>
            </div>
          }
          @if (projects().length === 0) {
            <div class="col-12 text-center py-5">
              <i class="bi bi-building fs-1 text-white-50"></i>
              <h5 class="mt-3 text-white-50">No projects match the selected filters</h5>
            </div>
          }
        </div>

        <!-- Lazy loading: more cards reveal automatically while scrolling; -->
        <!-- the button is a manual fallback for anyone who prefers to click. -->
        @if (hasMore()) {
          <div class="text-center mt-4">
            <div class="spinner-border text-primary spinner-border-sm mb-2" *ngIf="loadingMore()"></div>
            <button class="btn btn-outline-light rounded-pill px-4" (click)="loadMore()" [disabled]="loadingMore()">
              Load More Projects
            </button>
          </div>
        }
        <!-- Sentinel element the IntersectionObserver watches to auto-load more -->
        <div #scrollAnchor style="height:1px;"></div>
      </div>
    </div>
  `
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollAnchor') scrollAnchor?: ElementRef<HTMLDivElement>;

  projects = signal<any[]>([]);
  filters = { search: '', type: '', status: '' };
  bannerImage = signal('/project3.jpg');

  // Lazy loading — reveal projects in batches as the user scrolls, instead
  // of paged navigation (public project list — modest row counts, no need
  // to hit the server again; we just slice further into what's already loaded).
  visibleCount = signal(6);
  pageSize = 6;
  loadingMore = signal(false);
  private observer?: IntersectionObserver;

  constructor(
    private route: ActivatedRoute,
    private apiSvc: PublicApiService,
    private seo: SeoService,
    public ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.seo.generateTags('projects');
    if (isPlatformBrowser(this.platformId)) {
      // Parse query params if any
      this.route.queryParams.subscribe(params => {
        if (params['type']) this.filters.type = params['type'];
        if (params['status']) this.filters.status = params['status'];
        this.load();
      });

      this.apiSvc.getSettings().subscribe(res => {
        if (res.success && res.data && res.data.banner_projects) {
          this.bannerImage.set(res.data.banner_projects);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.scrollAnchor) return;
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.hasMore() && !this.loadingMore()) {
        this.loadMore();
      }
    }, { rootMargin: '200px' }); // start loading a bit before the sentinel is actually on screen
    this.observer.observe(this.scrollAnchor.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  load(): void {
    this.apiSvc.getProjects(this.filters).subscribe(res => {
      if (res.success && res.data && res.data.length > 0) {
        let data = res.data;
        if (this.filters.search) {
          const searchLower = this.filters.search.toLowerCase();
          data = data.filter((p: any) => 
            p.name.toLowerCase().includes(searchLower) || 
            (p.location && p.location.toLowerCase().includes(searchLower))
          );
        }
        if (this.filters.type) {
          const typeLower = this.filters.type.toLowerCase();
          data = data.filter((p: any) => {
            const cat = (p.category || '').toLowerCase();
            if (typeLower === 'building') return cat.includes('building') || cat.includes('construct');
            if (typeLower === 'infrastructure') return cat.includes('infra') || cat.includes('road') || cat.includes('park');
            if (typeLower === 'water') return cat.includes('water') || cat.includes('pipe');
            if (typeLower === 'industrial') return cat.includes('industrial') || cat.includes('godown') || cat.includes('house');
            return true;
          });
        }
        if (this.filters.status) {
          data = data.filter((p: any) => p.status.toLowerCase() === this.filters.status.toLowerCase());
        }
        this.projects.set(data);
      } else {
        this.projects.set([]);
      }
      this.visibleCount.set(this.pageSize);
    });
  }

  clearFilters(): void {
    this.filters = { search: '', type: '', status: '' };
    this.load();
  }

  pagedProjects(): any[] {
    return this.projects().slice(0, this.visibleCount());
  }

  hasMore(): boolean {
    return this.visibleCount() < this.projects().length;
  }

  loadMore(): void {
    if (!this.hasMore()) return;
    // Tiny delay so the spinner/button feedback is visible even though this
    // is just revealing more of an already-fetched list, not a new request.
    this.loadingMore.set(true);
    setTimeout(() => {
      this.visibleCount.set(this.visibleCount() + this.pageSize);
      this.loadingMore.set(false);
    }, 200);
  }
}
