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
      <section class="page-banner text-center text-white py-5 bg-dark" style="background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80'); background-size:cover; background-position:center; padding: 120px 0 !important;">
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
              @for (item of news(); track item.id) {
                <div class="col-md-6 mb-4">
                  <div class="card h-100 border rounded shadow-sm overflow-hidden">
                    <div class="card-body p-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary">{{ item.category }}</span>
                        <small class="text-muted">{{ item.date | date:'dd MMM yyyy' }}</small>
                      </div>
                      <h4 class="fw-bold mb-3">{{ item.title }}</h4>
                      <p class="text-secondary small mb-4 leading-relaxed">{{ item.summary }}</p>
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
              <h5 class="fw-bold mb-3 border-bottom pb-2">Topic Categories</h5>
              <ul class="list-unstyled mb-0">
                <li class="mb-2"><a href="#" class="text-decoration-none text-secondary small">Tenders & Awards</a></li>
                <li class="mb-2"><a href="#" class="text-decoration-none text-secondary small">Infrastructure Engineering</a></li>
                <li class="mb-2"><a href="#" class="text-decoration-none text-secondary small">Innovation & Safety</a></li>
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
}
