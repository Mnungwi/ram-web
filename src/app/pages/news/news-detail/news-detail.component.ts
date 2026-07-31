import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicApiService } from '../../../core/services/public-api.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="news-detail-page fade-in-page" *ngIf="article()">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5 bg-dark" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80'); background-size:cover; background-position:center; padding: 100px 0 !important;">
        <div class="container">
          <span class="badge bg-secondary text-uppercase px-3 py-2 mb-3">{{ article()!.category }}</span>
          <h1 class="display-5 fw-bold">{{ article()!.title }}</h1>
          <p class="text-light-50 small mt-2">Published: {{ article()!.date | date:'dd MMM yyyy' }}</p>
        </div>
      </section>

      <!-- Content -->
      <section class="news-article-content py-5 bg-white">
        <div class="container py-4">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <p class="fs-5 leading-relaxed mb-4 text-dark font-weight-500">
                {{ article()!.summary }}
              </p>
              <p class="text-secondary leading-relaxed mb-4">
                United Ram has consistently focused on delivering highly reliable highway networks across Africa. The engineering design for the newly awarded segment incorporates premium high-strength asphalt compounds and modern water runoff collection lines to maximize structural lifecycle.
              </p>
              <p class="text-secondary leading-relaxed mb-5">
                Our operations director emphasized that this project will engage local suppliers and labor resources, highlighting our commitment to community empowerment alongside industrial civil works.
              </p>
              
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

  constructor(private route: ActivatedRoute, private apiSvc: PublicApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiSvc.getNews().subscribe(res => {
      if (res.success && id) {
        const match = res.data.find((n: any) => n.id === id);
        this.article.set(match || res.data[0]);
      }
    });
  }
}
