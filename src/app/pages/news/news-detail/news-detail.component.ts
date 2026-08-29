import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { PublicApiService } from '../../../core/services/public-api.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="news-detail-page fade-in-page" *ngIf="article()">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5 bg-dark" [style.background-image]="'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(' + (article()!.image || '/project3.jpg') + ')'" style="background-size:cover; background-position:center; padding: 100px 0 !important;">
        <div class="container">
          <span class="badge bg-secondary text-uppercase px-3 py-2 mb-3">{{ article()!.category }}</span>
          <h1 class="display-5 fw-bold">{{ ts.pick(article()!.title, article()!.title_sw) }}</h1>
          <p class="text-light-50 small mt-2">Published: {{ article()!.date | date:'dd MMM yyyy' }}</p>
        </div>
      </section>

      <!-- Content -->
      <section class="news-article-content py-5 bg-white">
        <div class="container py-4">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <p class="fs-5 leading-relaxed mb-4 text-dark font-weight-500">
                {{ ts.pick(article()!.summary, article()!.summary_sw) }}
              </p>
              <p class="text-secondary leading-relaxed mb-5" style="white-space: pre-wrap;" *ngIf="article()!.content">{{ ts.pick(article()!.content, article()!.content_sw) }}</p>
              
              <div class="border-top pt-4">
                <a routerLink="/news" class="btn btn-outline-secondary rounded-pill px-4"><i class="bi bi-arrow-left me-2"></i>Back to News</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class NewsDetailComponent implements OnInit {
  article = signal<any | null>(null);

  constructor(
    private route: ActivatedRoute,
    private apiSvc: PublicApiService,
    public ts: TranslationService,
    private titleSvc: Title,
    private metaSvc: Meta,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiSvc.getNews().subscribe(res => {
      if (res.success && id) {
        const match = res.data.find((n: any) => n.id === id);
        const found = match || res.data[0];
        this.article.set(found);
        if (found) {
          const title = this.ts.pick(found.title, found.title_sw);
          this.titleSvc.setTitle(`${title} - News | United Ram Construction`);
          this.metaSvc.updateTag({ name: 'description', content: this.ts.pick(found.summary, found.summary_sw) || '' });
        }
      }
    });
  }
}
