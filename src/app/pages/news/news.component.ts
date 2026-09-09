import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/services/public-api.service';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="news-page fade-in-page">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5 bg-dark" style="background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/project3.jpg'); background-size:cover; background-position:center; padding: 120px 0 !important;">
        <div class="container">
          <h1 class="display-4 fw-bold">{{ ts.get('news.banner_title') }}</h1>
          <p class="lead text-white-50">{{ ts.get('news.banner_sub') }}</p>
        </div>
      </section>

      <!-- Articles List -->
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8">
            <div class="row">
              @for (item of filteredNews(); track item.id) {
                <div class="col-md-6 mb-4">
                  <div class="card h-100 border rounded shadow-sm overflow-hidden">
                    <div class="card-body p-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary">{{ item.category }}</span>
                        <small class="text-muted">{{ item.date | date:'dd MMM yyyy' }}</small>
                      </div>
                      <h4 class="fw-bold mb-3" style="color:#111827">{{ ts.pick(item.title, item.title_sw) }}</h4>
                      <p class="text-secondary small mb-4 leading-relaxed">{{ ts.pick(item.summary, item.summary_sw) }}</p>
                      <a [routerLink]="['/news', item.id]" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                        {{ ts.get('news.read_more') }} <i class="bi bi-arrow-right ms-1"></i>
                      </a>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          
          <div class="col-lg-4">
            <!-- Sidebar Widget -->
            <div class="card border p-4 rounded shadow-sm bg-white mb-4">
              <h5 class="fw-bold mb-3 border-bottom pb-2" style="color:#111827">Topic Categories</h5>
              <ul class="list-unstyled mb-0">
                <li class="mb-2">
                  <a href="javascript:void(0)" (click)="activeCategory.set(null)"
                     class="text-decoration-none small" [class.fw-bold]="!activeCategory()" [class.text-primary]="!activeCategory()" [class.text-secondary]="activeCategory()">
                    All Topics
                  </a>
                </li>
                @for (cat of categories(); track cat) {
                  <li class="mb-2">
                    <a href="javascript:void(0)" (click)="activeCategory.set(cat)"
                       class="text-decoration-none small" [class.fw-bold]="activeCategory()===cat" [class.text-primary]="activeCategory()===cat" [class.text-secondary]="activeCategory()!==cat">
                      {{ cat }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NewsComponent implements OnInit {
  news = signal<any[]>([]);
  activeCategory = signal<string | null>(null);

  constructor(
    private apiSvc: PublicApiService,
    public ts: TranslationService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.generateTags('news');
    this.apiSvc.getNews().subscribe(res => {
      if (res.success) this.news.set(res.data);
    });
  }

  categories(): string[] {
    const set = new Set<string>();
    for (const n of this.news()) {
      if (n.category) set.add(n.category);
    }
    return Array.from(set);
  }

  filteredNews(): any[] {
    const cat = this.activeCategory();
    if (!cat) return this.news();
    return this.news().filter(n => n.category === cat);
  }
}
